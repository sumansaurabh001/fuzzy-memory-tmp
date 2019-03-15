import * as functions from 'firebase-functions';
import {authenticationMiddleware} from './api-authentication.middleware';
import {auth, db} from './init';
import {getDocData} from './utils';

const express = require('express');
const cors = require('cors');

const firebase = require('firebase-admin');

const stripeSecretKey = functions.config().stripe.secret_key;

const application_fee_percent = functions.config().stripe.application_fee_percent;

const multi_tenant_mode = functions.config().platform.multi_tenant_mode;

const stripe = require('stripe')(stripeSecretKey);

const app = express();

// Automatically allow cross-origin requests
app.use(cors({origin: true}));

// only a signed-in user can purchase courses
app.use(authenticationMiddleware);


interface ReqInfo {
  tokenId: string;
  plan: any;
  userId: string;
  tenantId: string;
  oneTimeCharge: boolean;
  tenant?: any;
  user?: any;
}

app.post('/activate-plan', async (req, res) => {

  try {

    const reqInfo: ReqInfo = {
      tokenId: req.body.tokenId,
      plan: req.body.plan,
      userId: req.user.uid,
      tenantId: req.body.tenantId,
      oneTimeCharge: req.body.oneTimeCharge
    };

    // get the tenant from the database
    const tenantPath = `tenantSettings/${reqInfo.tenantId}`,
      tenant = await getDocData(tenantPath);

    // get the user from the database
    const userPath = `schools/${reqInfo.tenantId}/users/${reqInfo.userId}`,
      user = await getDocData(userPath);

    reqInfo.tenant = tenant;
    reqInfo.user = user;

    let response;

    if (reqInfo.oneTimeCharge) {
      response = await activateOneTimeChargePlan(reqInfo);
    }
    else {
      response = await activateRecurringPlan(reqInfo);
    }

    res.status(200).json(response);

  }
  catch (error) {
    console.log('Unexpected error occurred while creating subscription: ', error);
    res.status(500).json({error});
  }

});

async function activateRecurringPlan(reqInfo: ReqInfo) {

  const tenantConfig = multi_tenant_mode ? {stripe_account: reqInfo.tenant.stripeTenantUserId} : {};

  // create the stripe customer
  const customer = await stripe.customers.create({
    source: reqInfo.tokenId,
    email: reqInfo.user.email
  }, tenantConfig);

  console.log('Created Stripe customer ' + customer.id);

  // create the stripe subscription
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [
      {
        plan: reqInfo.plan.stripePlanId,
      },
    ],
    application_fee_percent
  }, tenantConfig);

  console.log('Created Stripe subscription: ' + subscription.id);

  const userPrivatePath = `schools/${reqInfo.tenantId}/usersPrivate/${reqInfo.userId}`;

  const response = {
    planActivatedAt: subscription.created * 1000
  };

  await db.doc(userPrivatePath).set({
      stripeCustomerId: customer.id,
      stripeSubscriptionId: subscription.id,
      planEndsAt: null,
      pricingPlan: reqInfo.plan.frequency,
      planActivatedAt: firebase.firestore.Timestamp.fromMillis(response.planActivatedAt)
    },
    {merge: true});

  return response;
}


async function activateOneTimeChargePlan(reqInfo: ReqInfo) {

  const tenantConfig = multi_tenant_mode ? {stripe_account: reqInfo.tenant.stripeTenantUserId} : {};

  await stripe.charges.create({
    amount: reqInfo.plan.price,
    currency: 'usd',
    source: reqInfo.tokenId,
    application_fee: application_fee_percent / 100 * reqInfo.plan.price
  },
    tenantConfig);

  console.log('Created Stripe one-time plan: ' + reqInfo.plan.frequency);

  const userPrivatePath = `schools/${reqInfo.tenantId}/usersPrivate/${reqInfo.userId}`;

  const response = {
    pricingPlan: reqInfo.plan.frequency,
    planEndsAt: null
  };

  await db.doc(userPrivatePath).set(response, {merge: true});


  return response;

}


export const apiStripeActivatePlan = functions.https.onRequest(app);



