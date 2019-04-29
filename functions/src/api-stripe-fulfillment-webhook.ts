import * as functions from 'firebase-functions';
import {getDocData} from './utils';
import {db} from './init';

const firebase = require('firebase-admin');

const stripeSecretKey = functions.config().stripe.secret_key;

const stripe = require('stripe')(stripeSecretKey);

// Find your endpoint's secret in your Dashboard's webhook settings
const endpointSecret = functions.config().stripe.webhook_secret;

const express = require('express');

const app = express();

interface ReqInfo {
  ongoingPurchaseSessionId:string;
  tenantId:string;
  stripeCustomerId:string,
  stripeSubscriptionId?:string;
  userId?:string;
}

/*
*
* Fulfillment webhook for Stripe purchases, based on these docs:
*
*  https://stripe.com/docs/payments/checkout/fulfillment#webhooks
*
*
*/

app.post('/stripe-fulfillment-webhook', async (request, response) => {

  let sig = request.headers["stripe-signature"];

  try {

    const event = stripe.webhooks.constructEvent(request.rawBody, sig, endpointSecret);

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {

      const session = event.data.object;

      console.log("Fulfillment ongoing of session: ", JSON.stringify(session));

      // Fulfill the purchase...
      await handleCheckoutSession(session);

    }
  }
  catch (err) {
    console.log("Error processing session checkout event:", err);
    response.status(400).end();
  }

  // Return a response to acknowledge receipt of the event
  response.status(200).json({received: true});
});


async function handleCheckoutSession(session) {

  // simulate webhook delayed call
  // await new Promise(resolve => setTimeout(() => resolve(), 10000));

  const clientReferenceIdParams = session.client_reference_id ? session.client_reference_id.split('|'): [];

  const reqInfo: ReqInfo = {
    stripeCustomerId: session.customer,
    stripeSubscriptionId: session.subscription,
    ongoingPurchaseSessionId: clientReferenceIdParams[0],
    tenantId: clientReferenceIdParams[1]
  };

  // get the ongoing purchase session
  const purchaseSessionPath = `schools/${reqInfo.tenantId}/purchaseSessions/${reqInfo.ongoingPurchaseSessionId}`;

  const purchaseSession = await getDocData(purchaseSessionPath);

  reqInfo.userId = purchaseSession.userId;

  if (purchaseSession.courseId) {
    await fulfillCoursePurchase(reqInfo, purchaseSession.courseId);
  }
  else if (purchaseSession.plan) {
    await fulfillPlanSubscription(reqInfo, purchaseSession.plan);
  }

  await db.doc(purchaseSessionPath).update({status: "completed"});

}


async function fulfillPlanSubscription(reqInfo:ReqInfo, plan:string) {

  const usersPrivatePath = `schools/${reqInfo.tenantId}/usersPrivate/${reqInfo.userId}`;

  await db.doc(usersPrivatePath).set({
      stripeCustomerId: reqInfo.stripeCustomerId,
      stripeSubscriptionId: reqInfo.stripeSubscriptionId,
      planEndsAt: null,
      pricingPlan: plan,
      planActivatedAt: firebase.firestore.Timestamp.fromMillis(new Date().getTime())
    },
    {merge: true});

}



async function fulfillCoursePurchase(reqInfo:ReqInfo, courseId:string) {

  const usersPrivatePath = `schools/${reqInfo.tenantId}/usersPrivate/${reqInfo.userId}`;

  let userPrivate = await getDocData(usersPrivatePath);

  if (!userPrivate || !userPrivate.purchasedCourses) {
    userPrivate = {
      purchasedCourses: []
    };
  }

  userPrivate.purchasedCourses.push(courseId);

  await db.doc(usersPrivatePath).set(userPrivate, {merge: true});

}

export const apiStripeFulfillmentWebhook = functions.https.onRequest(app);


