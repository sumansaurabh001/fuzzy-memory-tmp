import * as functions from 'firebase-functions';
import {authenticationMiddleware} from './api-authentication.middleware';
import {auth, db} from './init';
import {getDocData} from './utils';


const request = require('request-promise');
const express = require('express');
const cors = require('cors');

const stripeSecretKey = functions.config().stripe.secret_key;

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

    const tokenId = req.body.tokenId,
      courseId = req.body.courseId,
      userId = req.user.uid,
      tenantId = req.body.tenantId;

    // get the course from the database
    const course = await getDocData(`schools/${tenantId}/courses/${courseId}`);

    // get the tenant from the database
    const tenant = await getDocData(`tenantSettings/${tenantId}`);

    const priceAmount = course.price * 100;

    const tenantConfig = multi_tenant_mode ? {stripe_account: tenant.stripeTenantUserId} : {};

    // charge the end customer on behalf of the tenant and apply fees
    await stripe.charges.create({
      amount: priceAmount,
      currency: 'usd',
      source: tokenId,
      application_fee: application_fee_percent / 100 * priceAmount
    }, tenantConfig);

    // add the course to the user's list of purchased courses
    const usersPrivatePath = `schools/${tenantId}/usersPrivate/${userId}`;

    let userPrivate = await getDocData(usersPrivatePath);

    if (!userPrivate || !userPrivate.purchasedCourses) {
      userPrivate = {
        purchasedCourses: []
      }
    }

    userPrivate.purchasedCourses.push(courseId);

    await db.doc(usersPrivatePath).set(userPrivate, {merge:true});

    res.status(200).json({message: 'Payment processed successfully.'});

  }
  catch (error) {
    console.log('Unexpected error occurred while purchasing course: ', error);
    res.status(500).json({error});
  }

});


export const apiPurchaseCourse = functions.https.onRequest(app);



