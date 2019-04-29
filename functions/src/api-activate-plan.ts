import * as functions from 'firebase-functions';
import {authenticationMiddleware} from './api-authentication.middleware';
import {auth, db} from './init';
import {getDocData} from './utils';
const uuidv4 = require('uuid/v4');

const express = require('express');
const cors = require('cors');

const firebase = require('firebase-admin');

const stripeSecretKey = functions.config().stripe.secret_key;

const stripePublicKey = functions.config().stripe.public_key;

const application_fee_percent = functions.config().stripe.application_fee_percent;

const multi_tenant_mode = functions.config().platform.multi_tenant_mode;

const stripe = require('stripe')(stripeSecretKey);

const app = express();

// Automatically allow cross-origin requests
app.use(cors({origin: true}));

// only a signed-in user can purchase courses
app.use(authenticationMiddleware);


interface ReqInfo {
  plan: any;
  userId: string;
  tenantId: string;
  oneTimeCharge: boolean;
  subscriptionUrl:string;
  tenant?: any;
  user?: any;
}

app.post('/activate-plan', async (req, res) => {

  try {

    const reqInfo: ReqInfo = {
      plan: req.body.plan,
      userId: req.user.uid,
      tenantId: req.body.tenantId,
      oneTimeCharge: req.body.oneTimeCharge,
      subscriptionUrl: req.body.subscriptionUrl
    };

    // get the tenant from the database
    const tenantPath = `tenantSettings/${reqInfo.tenantId}`,
      tenant = await getDocData(tenantPath);

    // get the user from the database
    const userPath = `schools/${reqInfo.tenantId}/users/${reqInfo.userId}`,
      user = await getDocData(userPath);

    reqInfo.tenant = tenant;
    reqInfo.user = user;

    const tenantConfig = multi_tenant_mode ? {stripe_account: reqInfo.tenant.stripeTenantUserId} : {};

    const ongoingPurchaseSessionId = uuidv4();

    let sessionConfig:any = {
      success_url: `${reqInfo.subscriptionUrl}?purchaseResult=success&ongoingPurchaseSessionId=${ongoingPurchaseSessionId}`,
      cancel_url: `${reqInfo.subscriptionUrl}?purchaseResult=failed`,
      payment_method_types: ['card'],
      client_reference_id: ongoingPurchaseSessionId + "|" + reqInfo.tenantId
    };

    if (reqInfo.oneTimeCharge) {
      sessionConfig = {
        ...sessionConfig,
        line_items: [{
          currency: 'usd',
          amount: reqInfo.plan.price * 100,
          quantity:1,
          name: reqInfo.plan.description
        }],
        payment_intent_data: {
          application_fee_amount: application_fee_percent  * reqInfo.plan.price
        }
      }
    } else {
      sessionConfig = {
        ...sessionConfig,
        subscription_data: {
          items: [{plan: reqInfo.plan.stripePlanId}]
        }
      }
    }

    // create a checkout session
    const session = await stripe.checkout.sessions.create(sessionConfig, tenantConfig);

    console.log("Created plan activation session: ", JSON.stringify(session));

    // save the ongoing purchase session
    const purchaseSessionsPath = `schools/${reqInfo.tenantId}/purchaseSessions/${ongoingPurchaseSessionId}`;

    await db.doc(purchaseSessionsPath).set({
      plan: reqInfo.plan.frequency,
      userId: reqInfo.userId,
      status: 'ongoing'
    });

    const stripeSession = {
      sessionId:session.id,
      stripePublicKey: stripePublicKey,
      stripeTenantUserId:reqInfo.tenant.stripeTenantUserId,
      ongoingPurchaseSessionId
    };

    res.status(200).json(stripeSession);

  } catch (error) {
    console.log('Unexpected error occurred while creating subscription: ', error);
    res.status(500).json({error});
  }

});

export const apiStripeActivatePlan = functions.https.onRequest(app);

