import * as functions from 'firebase-functions';
import {authenticationMiddleware} from './api-authentication.middleware';
import {auth, db} from './init';
import {getDocData} from './utils';
import {sendEmail} from './send-email';

const express = require('express');
const cors = require('cors');

const firebase = require('firebase-admin');

const stripeSecretKey = functions.config().stripe.secret_key;

const multi_tenant_mode = functions.config().platform.multi_tenant_mode;

const stripe = require('stripe')(stripeSecretKey);

const app = express();

// Automatically allow cross-origin requests
app.use(cors({origin: true}));

app.use(authenticationMiddleware);


app.post('/cancel-plan', async (req, res) => {

  try {

    const userId = req.user.uid,
      tenantId = req.body.tenantId,
      customerEmail = req.body.user.email,
      customerName = req.body.user.displayName,
      reason = req.body.reason;

    const tenantSettingsPath = `tenantSettings/${tenantId}`,
      tenantSettings = await getDocData(tenantSettingsPath),
      tenantPath = `tenants/${tenantId}`,
      tenant =  await getDocData(tenantPath),
      userPrivatePath = `schools/${tenantId}/usersPrivate/${userId}`,
      userPrivate = await getDocData(userPrivatePath);

    if (!userPrivate) {
      throw "Could not find user private data in path: " + userPrivatePath;
    }

    const tenantConfig = multi_tenant_mode ? {stripe_account: tenantSettings.stripeTenantUserId} : {};

    console.log("cancelling plan of user:", JSON.stringify(userPrivate));

    // cancel the Stripe pricing plan
    const result = await stripe.subscriptions.update(
      userPrivate.stripeSubscriptionId,
      {
        cancel_at_period_end: true
      },
      tenantConfig);

    console.log("Cancelled Stripe subscription: " + result.id);

    const planEndsAt = result.current_period_end * 1000;

    // save cancellation date in database
    const changes = {
      planEndsAt: firebase.firestore.Timestamp.fromMillis(planEndsAt)
    };

    await db.doc(userPrivatePath).update(changes);

    console.log("Sending cancelation reason email to tenant mailbox: " + tenant.email);

    // send email (with the cancellation reason) to the monitoring mailbox
    await sendEmail({
      from: 'noreply@onlinecoursehost.com',
      to: tenant.email,
      subject: 'Customer cancellation reason',
      text: `Customer ${customerEmail} (${customerName}) cancelled with reason:\n\n${reason}`
    });

    res.status(200).json({planEndsAt});

  }
  catch (error) {
    console.log('Unexpected error occurred while cancelling subscription: ', error);
    res.status(500).json({error});
  }

});


export const apiStripeCancelPlan = functions.https.onRequest(app);



