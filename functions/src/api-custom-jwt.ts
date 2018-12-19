import * as functions from 'firebase-functions';
import {authenticationMiddleware} from './api-authentication.middleware';
import {auth} from './init';

const request = require('request-promise');
const express = require('express');
const cors = require('cors');

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// only a signed-in user can create custom JWT tokens
app.use(authenticationMiddleware);


/**
 *
 * This service creates a custom jwt Authentication token. This token is used as part
 * of the authentication solution for tenant websites (and not the platform website).
 *
 **/

app.post('/custom-jwt', async (req, res) => {

  try {

    const userUid = req.body.uid,
          requesterUid = req.user.uid;

    console.log('Creating JWT for uid:' + userUid);

    if (userUid != requesterUid) {
      throw 'Currently, a user can only create authentication JWT tokens for himself. ' +
      'in the future it will be possible for admin users to create JWTs for other users as well.';
    }

    const customJWt = await auth.createCustomToken(userUid);

    res.status(200).json({customJWt});

  }
  catch(error) {
    console.log("Unexpected error occurred creating custom JWT: ", error);
    res.status(500).json({error});
  }

});



export const apiCreateCustomJwt  = functions.https.onRequest(app);




