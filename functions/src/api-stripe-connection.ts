import * as functions from 'firebase-functions';
import {db} from './init';

const request = require('request-promise');
const express = require('express');

const cors = require('cors')({origin: true});

const STRIPE_ACCESS_TOKEN_URL = 'https://connect.stripe.com/oauth/token';







export const apiStripeConnection  = functions.https.onRequest((req,res) => {
  return cors(req, res, async () => {

    try {

      const authorizationCode = req.body.authorizationCode,
        tenantId = req.body.tenantId;

      const clientSecret = functions.config().stripe.secret_key;

      console.log('Fetching user credentials from Stripe.');
      console.log(`authorizationCode=${authorizationCode}, clientSecret=${clientSecret}`);

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
        refreshToken = results.refresh_token;

      if (!stripeTenantUserId) {
        apiError(res, `Could not retrieve Stripe user Id.`);
      }

      await db.doc(`tenantSettings/${tenantId}`).set({stripeTenantUserId, refreshToken}, { merge: true });

      res.status(200).json({message:'Stripe connection ready.', stripeTenantUserId});

    }
    catch(error) {
      console.log("Unexpected error occurred: ", error);
      res.status(500).json({error});
    }

  });
});




function apiError(res, errorDescription) {
  console.log(errorDescription);
  res.status(500).json({errorDescription});
}



