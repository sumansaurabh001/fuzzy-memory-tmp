import {Controller, Post, Req, Res} from '@nestjs/common';
import {FirestoreService} from '../services/firestore.service';
import {getStripeSecretKey, readMandatoryEnvVar} from '../utils/utils';
import {Email, sendEmail} from '../utils/send-email';
import {Timestamp} from '@google-cloud/firestore';


@Controller()
export class StripeCancelSubscriptionWebhookController {

  constructor(private readonly firestore: FirestoreService) {

  }


  @Post('/api/stripe-webhooks/cancel-subscription')
  async apiStripeCancelSubscriptionWebhook(@Req() request, @Res() response): Promise<any> {

    let sig = request.headers["stripe-signature"];

    try {

      console.log("Called Stripe cancel subscription webhook ...");

      const rawBody = request.body,
        body = JSON.parse(rawBody);

      const stripe = require('stripe')(getStripeSecretKey(!body.livemode));

      const event = stripe.webhooks.constructEvent(rawBody, sig, readMandatoryEnvVar("STRIPE_CANCEL_SUBSCRIPTION_ENDPOINT_SECRET"));

      console.log('Event type: ' + event.type);

      if (event.type === 'customer.subscription.updated' ||
        event.type === 'customer.subscription.deleted') {

        const subscription = event.data.object;

        await this.handleSubscriptionStatusChange(subscription, body.account);

      }
    }
    catch (err) {
      console.log("Error processing cancelled subscription webhook! => ", JSON.stringify(err));
      // Return a response to acknowledge receipt of the event
      response.status(400).json(`Webhook Error: ${err}`);
    }

    console.log("Sending cancelled subscription webhook reply!");

    // Return a response to acknowledge receipt of the event
    response.status(200).json({received: true});

  }


  async  handleSubscriptionStatusChange(subscription, connectAccountId:string) {

    console.log('got notification for subscription state change', JSON.stringify(subscription.status));

    if (subscription.status == "canceled" || subscription.status == 'unpaid' || subscription.cancel_at_period_end) {

      const stripeSubscriptionId = subscription.id;

      console.log("Finding tenantId ...");

      const tenantId = await this.findTenantId(connectAccountId);

      console.log('Finding user to cancel subscription under users of tenant ' + tenantId);

      const [userId, userPrivate] = await this.findUser(tenantId, stripeSubscriptionId);

      //only cancel the subscription and send the email if the subscription is still active
      if (userPrivate.pricingPlan) {

        console.log("Cancelling user subscription " + stripeSubscriptionId);

        const planEndsAt = subscription.current_period_end * 1000;

        // save cancellation date in database
        const changes = {
          planEndsAt: Timestamp.fromMillis(planEndsAt)
        };

        await this.firestore.db.doc(`/schools/${tenantId}/usersPrivate/${userId}`).update(changes);

        console.log("User subscription canceled, sending notification email to user");

        const tenant = await this.firestore.db.doc(`tenants/${tenantId}`).get();

        const user = await this.firestore.db.doc(`schools/${tenantId}/users/${userId}`).get();

        await this.sendUnpaidSubscriptionEmail(tenant.data(), user.data());

      }

    }

  }

  async findTenantId(connectAccountId:string) {

    const snaps = await this.firestore.db.collection("tenantSettings").where("stripeTenantUserId", "==", connectAccountId).get();

    if (snaps.size == 0) {
      throw `Could not find tenant on tenantSettings with stripeTenantUserId ${connectAccountId}`;
    }

    if (snaps.size > 1) {
      throw `Found more than one tenantSettings with stripeTenantUserId ${connectAccountId}`;
    }

    return snaps.docs[0].id;
  }


  async findUser(tenantId:string, stripeSubscriptionId:string) {

    const snaps = await this.firestore.db.collection(`/schools/${tenantId}/usersPrivate`).where("stripeSubscriptionId", "==", stripeSubscriptionId).get();

    if (snaps.size == 0) {
      throw `Could not find user on usersPrivate with stripeSubscriptionId ${stripeSubscriptionId}`;
    }

    if (snaps.size > 1) {
      throw `Found more than one user with stripeSubscriptionId ${stripeSubscriptionId}`;
    }

    return [snaps.docs[0].id, snaps.docs[0].data()];

  }


  async sendUnpaidSubscriptionEmail(tenant, user) {

    var message: Email = {
      from: `${tenant.schoolName} <${tenant.supportEmail}>`,
      to: user.email,
      subject: `${tenant.schoolName} account canceled`,
      text: `

Hello,
Just to let you know that because the recent payment attempts with your card did not go through, we assumed that you are no longer using the site and so we have canceled the account in order to avoid any unintended charges on your card.

If this was not intended, please login to the website and activate a new subscription. 

If you have issues logging in, please contact us at ${tenant.supportEmail} and we will look into it.

I'm sorry to see you go, you are welcome back anytime and I hope you enjoyed the courses. 

Thanks & Kind Regards,
${tenant.schoolName} 

`
    };

    await sendEmail(message);


  }
}
