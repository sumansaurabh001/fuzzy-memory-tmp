import * as functions from 'firebase-functions';
import {authenticationMiddleware} from './api-authentication.middleware';
import {convertSnapsToData, getDocData, isFutureTimestamp} from './utils';
import {db} from './init';
import {keepEndpointAliveMiddleware} from './keep-endpoint-alive-middleware';


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

app.use(keepEndpointAliveMiddleware);

// only a signed-in user can purchase courses
app.use(authenticationMiddleware);


app.post('/purchase-course', async (req, res) => {

  try {

    const courseId = req.body.courseId,
      userId = req.user.uid,
      tenantId = req.body.tenantId,
      courseUrl = req.body.courseUrl,
      couponCode = req.body.couponCode;

    // get the course from the database
    const course = await getDocData(`schools/${tenantId}/courses/${courseId}`);

    // get the tenant from the database
    const tenant = await getDocData(`tenantSettings/${tenantId}`);

    const priceAmount = course.price * 100;

    const tenantConfig = multi_tenant_mode ? {stripe_account: tenant.stripeTenantUserId} : {};

    const ongoingPurchaseSessionId = uuidv4();

    const couponPaths = `schools/${tenantId}/courses/${courseId}/coupons`;

    let coupon = null;

    if (couponCode) {
      const snaps = await db.collection(couponPaths).where('code', '==', couponCode).get();
      const results = convertSnapsToData(snaps);
      coupon = results.length == 1 ? results[0] : null;
    }

    const amount = determineChargePrice(course, coupon);

    const clientReferenceId = ongoingPurchaseSessionId + "|" + tenantId;

    const sessionConfig = {
      success_url: `${courseUrl}?purchaseResult=success&ongoingPurchaseSessionId=${ongoingPurchaseSessionId}&courseId=${courseId}`,
      cancel_url: `${courseUrl}?purchaseResult=failed`,
      payment_method_types: ['card'],
      client_reference_id: clientReferenceId,
      line_items: [{
        currency: 'usd',
        amount: amount * 100,
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
    const purchaseSessionsPath = `schools/${tenantId}/purchaseSessions/${ongoingPurchaseSessionId}`;

    await db.doc(purchaseSessionsPath).set({
      courseId,
      userId,
      status: 'ongoing',
      couponId: isCouponValid(coupon) ? coupon.id : null
    });

    const stripeSession = {
      sessionId:session.id,
      stripePublicKey: stripePublicKey,
      stripeTenantUserId:tenant.stripeTenantUserId,
      ongoingPurchaseSessionId
    };

    res.status(200).json(stripeSession);

  }
  catch (error) {
    console.log('Unexpected error occurred while purchasing course: ', error);
    res.status(500).json({error});
  }

});



function determineChargePrice(course, coupon) {

  if (!coupon) {
    return course.price;
  }

  if (isCouponValid(coupon)) {
    return coupon.price;
  }
  else {
    return course.price;
  }
}

function isCouponValid(coupon) {
  if (!coupon) {
    return false;
  }

  return coupon.active && coupon.remaining > 0 && ( !coupon.deadline || isFutureTimestamp(coupon.deadline));
}


export const apiPurchaseCourse = functions.https.onRequest(app);



