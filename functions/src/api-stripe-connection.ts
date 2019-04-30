import * as functions from 'firebase-functions';
import {db} from './init';
import {apiError} from './api-utils';
import {keepEndpointAliveMiddleware} from './keep-endpoint-alive-middleware';

const request = require('request-promise');
const express = require('express');

const cors = require('cors');

const STRIPE_ACCESS_TOKEN_URL = 'https://connect.stripe.com/oauth/token';


const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.use(keepEndpointAliveMiddleware);


/**
 *
 * Public API end point that allows to check if the tenant is already connected to Stripe Connect or not.
 *
 * The Stripe credentials are not sent in response, only a status flag.
 *
 ***/

app.get('/stripe-connection', async (req, res) => {

  try {

    const tenantId = req.query.tenantId;

    console.log(`Checking connection status for tenant ${tenantId}`);

    const snap = await db.doc(`tenantSettings/${tenantId}`).get();

    const stripeSettings = snap.data();

    console.log("Retrieved Stripe settings: " + JSON.stringify(stripeSettings) );

    res.status(200).json({isConnectedToStripe:stripeSettings && !!stripeSettings.stripeTenantUserId});

  }
  catch(error) {
    console.log("Unexpected error occurred processing GET: ", error);
    res.status(500).json({error});
  }

});


/*
*
* Do a POST to this endpoint to establish a connection via Stripe Connect.
*
* This endpoint will call Stripe Connect, and retrieve and save the tenant Stripe credentials in the database.
*
* The Stripe credentials are not visible or editable on the client, so that is why we need this endpoint
* instead of doing all this directly on the frontend.
*
***/

app.post('/stripe-connection', async (req,res) => {

    try {

      const authorizationCode = req.body.authorizationCode,
        tenantId = req.body.tenantId;

      const clientSecret = functions.config().stripe.secret_key;

      console.log('Fetching user credentials from Stripe.');
      console.log(`authorizationCode=${authorizationCode}, clientSecret=${clientSecret}`);

      // call Stripe and retrieve tenant Credentials
      const results = await request({
        method: 'POST',
        uri: STRIPE_ACCESS_TOKEN_URL,
        body: {
          client_secret: clientSecret,
          code: authorizationCode,
          grant_type: 'authorization_code'
        },
        json: true
      });

      if (results.error) {
        apiError(res, `Error fetching Stripe credentials: ${results.error} - ${results.error_description}`);
      }

      const stripeTenantUserId = results.stripe_user_id,
        stripeRefreshToken = results.refresh_token;

      if (!stripeTenantUserId) {
        apiError(res, `Could not retrieve Stripe user Id.`);
      }

      const settings = {stripeTenantUserId, stripeRefreshToken};

      // write Stripe credentials to database
      await db.doc(`tenantSettings/${tenantId}`).set(settings, { merge: true });

      res.status(200).json({message:'Stripe connection ready.', stripeTenantUserId});

    }
    catch(error) {
      console.log("Unexpected error occurred processing POST: ", error);
      res.status(500).json({error});
    }

});


export const apiStripeConnection  = functions.https.onRequest(app);







