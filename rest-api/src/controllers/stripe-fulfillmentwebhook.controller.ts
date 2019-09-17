import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { FirestoreService } from '../services/firestore.service';
import {getStripeSecretKey, readMandatoryEnvVar} from '../utils/utils';
import {FieldValue, Timestamp} from '@google-cloud/firestore';

const MULTI_TENANT_MODE = readMandatoryEnvVar("MULTI_TENANT_MODE");

interface ReqInfo {
  ongoingPurchaseSessionId:string;
  tenantId:string;
  stripeCustomerId:string,
  stripeSubscriptionId?:string;
  userId?:string;
}


@Controller()
export class StripeFulfillmentwebhookController {

  constructor(private readonly firestore: FirestoreService) {}

  @Post('/api/stripe-webhooks/fulfillment')
  async apiStripeFulfillmentWebhook(@Req() request, @Res() response): Promise<any> {

    let sig = request.headers["stripe-signature"];

    try {

      console.log("Called Stripe fulfillment webhook ...");

      const rawBody = request.body,
            body = JSON.parse(rawBody);

      const stripe = require('stripe')(getStripeSecretKey(!body.livemode));

      const event = stripe.webhooks.constructEvent(rawBody, sig, readMandatoryEnvVar("STRIPE_FULFILLMENT_ENDPOINT_SECRET"));

      // Handle the checkout.session.completed event
      if (event.type === 'checkout.session.completed') {

        const session = event.data.object;

        // Fulfill the purchase...
        await this.handleCheckoutSession(stripe, session, body.account);

      }
    }
    catch (err) {
      console.log("Error processing session checkout event:", err);
      response.status(400).end();
    }

    // Return a response to acknowledge receipt of the event
    response.status(200).json({received: true});

  }

  async  handleCheckoutSession(stripe, session, connectAccountId:string) {

    // simulate webhook delayed call
    // await new Promise(resolve => setTimeout(() => resolve(), 10000));

    const clientReferenceIdParams = session.client_reference_id ? session.client_reference_id.split('|'): [];

    const reqInfo: ReqInfo = {
      stripeCustomerId: session.customer,
      stripeSubscriptionId: session.subscription,
      ongoingPurchaseSessionId: clientReferenceIdParams[0],
      tenantId: clientReferenceIdParams[1]
    };

    console.log('Finding purchase session...');

    // get the ongoing purchase session
    const purchaseSessionPath = `schools/${reqInfo.tenantId}/purchaseSessions/${reqInfo.ongoingPurchaseSessionId}`;

    const purchaseSession = await this.firestore.getDocData(purchaseSessionPath);

    reqInfo.userId = purchaseSession.userId;

    if (purchaseSession.courseId) {
      console.log('Fulfilling course purchase...');
      await this.fulfillCoursePurchase(reqInfo, purchaseSession);
    }
    else if (purchaseSession.plan) {
      console.log('Fulfilling subscription purchase...');
      await this.fulfillPlanSubscription(reqInfo, purchaseSession.plan);
    }

    // save the card details later, not to block the purchase experience
    setTimeout(async() => {

      await this.storeCardDetails(stripe, reqInfo, connectAccountId);

    }, 10000);


    await this.firestore.db.doc(purchaseSessionPath).update({status: "completed"});

  }

  async storeCardDetails(stripe, reqInfo:ReqInfo, connectAccountId:string) {

    console.log("Storing card details ...");

    const tenantConfig = MULTI_TENANT_MODE ? {stripe_account: connectAccountId} : {};

    const subscription = await stripe.subscriptions.retrieve(reqInfo.stripeSubscriptionId, tenantConfig);

    console.log("Retrieved subscription ", JSON.stringify(subscription));

    const method = await stripe.paymentMethods.retrieve(subscription.default_payment_method, tenantConfig);

    console.log("Retrieved card ", JSON.stringify(method));

    const usersPath = `schools/${reqInfo.tenantId}/users/${reqInfo.userId}`;

    await this.firestore.db.doc(usersPath).update({
      cardExpirationMonth: method.card.exp_month,
      cardExpirationYear: method.card.exp_year,
      cardLast4Digits: method.card.last4
    });

  }


  async  fulfillPlanSubscription(reqInfo:ReqInfo, plan:string) {

    const usersPrivatePath = `schools/${reqInfo.tenantId}/usersPrivate/${reqInfo.userId}`;

    const changes:any = {
      planEndsAt: null,
      pricingPlan: plan,
      planActivatedAt: Timestamp.fromMillis(new Date().getTime())
    };

    if (reqInfo.stripeCustomerId) {
      changes.stripeCustomerId = reqInfo.stripeCustomerId;
    }

    if (reqInfo.stripeSubscriptionId) {
      changes.stripeSubscriptionId = reqInfo.stripeSubscriptionId;
    }

    await this.firestore.db.doc(usersPrivatePath).set(changes, {merge: true});

  }



  async  fulfillCoursePurchase(reqInfo:ReqInfo, purchaseSession:any) {

    const usersPrivatePath = `schools/${reqInfo.tenantId}/usersPrivate/${reqInfo.userId}`;

    let userPrivate = await this.firestore.getDocData(usersPrivatePath);

    let purchasedCourses = userPrivate && userPrivate.purchasedCourses ? userPrivate.purchasedCourses : [];

    purchasedCourses.push(purchaseSession.courseId);

    const batch = this.firestore.db.batch();

    const userPrivateRef = this.firestore.db.doc(usersPrivatePath);

    batch.set(userPrivateRef, {
        purchasedCourses,
        stripeCustomerId: reqInfo.stripeCustomerId
      },
      {merge: true});

    if (purchaseSession.couponId) {

      const couponRef = this.firestore.db.doc(`schools/${reqInfo.tenantId}/courses/${purchaseSession.courseId}/coupons/${purchaseSession.couponId}`);

      batch.update(couponRef, {
        "remaining": FieldValue.increment(-1)
      });

    }

    await batch.commit();

  }


}
