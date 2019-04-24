import * as functions from 'firebase-functions';
import {authenticationMiddleware} from './api-authentication.middleware';
import {getDocData} from './utils';
import {db} from './init';


const request = require('request-promise');
const express = require('express');
const cors = require('cors');
const uuidv4 = require('uuid/v4');

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


app.post('/purchase-course', async (req, res) => {

  try {

    const courseId = req.body.courseId,
      userId = req.user.uid,
      tenantId = req.body.tenantId,
      courseUrl = req.body.courseUrl;

    // get the course from the database
    const course = await getDocData(`schools/${tenantId}/courses/${courseId}`);

    // get the tenant from the database
    const tenant = await getDocData(`tenantSettings/${tenantId}`);

    const priceAmount = course.price * 100;

    const tenantConfig = multi_tenant_mode ? {stripe_account: tenant.stripeTenantUserId} : {};

    const ongoingPurchaseSessionId = uuidv4();

    const sessionConfig = {
      success_url: `${courseUrl}?purchaseResult=success&ongoingPurchaseSessionId=${ongoingPurchaseSessionId}&courseId=${courseId}`,
      cancel_url: `${courseUrl}?purchaseResult=failed`,
      payment_method_types: ['card'],
      line_items: [{
        currency: 'usd',
        amount: course.price * 100,
        quantity:1,
        name: course.title
      }],

      payment_intent_data: {
        application_fee_amount: application_fee_percent / 100 * priceAmount
      }
    };

    // create a checkout session to purchase the course
    const session = await stripe.checkout.sessions.create(sessionConfig, tenantConfig);

    // save the ongoing purchase session
    const purchaseSessionsPath = `schools/${tenantId}/purchaseSessions/${userId}`;

    await db.doc(purchaseSessionsPath).set({ongoingPurchaseSessionId, courseId});

    const stripeSession = {
      sessionId:session.id,
      stripePublicKey: stripePublicKey,
      stripeTenantUserId:tenant.stripeTenantUserId
    };

    res.status(200).json(stripeSession);

  }
  catch (error) {
    console.log('Unexpected error occurred while purchasing course: ', error);
    res.status(500).json({error});
  }

});


export const apiPurchaseCourse = functions.https.onRequest(app);



