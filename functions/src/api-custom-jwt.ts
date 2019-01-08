import * as functions from 'firebase-functions';
import {authenticationMiddleware} from './api-authentication.middleware';
import {auth, db} from './init';

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
 * This service creates a custom jwt Authentication token. This token is what authenticates and sets security roles for a user
 * in tenant websites and tenant subdomains.
 *
 * The following restrictions apply:
 *
 * - only authenticated users can create tokens
 *
 * - Currently, users can only create authentication tokens for themselves
 *
 * - the resulting token will not only authenticate the user, but it will also contain the roles of the user for a given tenant website (according to the database)
 *
 **/

app.post('/custom-jwt', async (req, res) => {

  try {

    const userUid = req.body.uid,
          tenantId = req.body.tenantId,
          requesterUid = req.user.uid;

    console.log('Creating JWT for uid:' + userUid);

    if (userUid != requesterUid) {
      throw 'Currently, a user can only create authentication JWT tokens for himself. ' +
      'In the future it will be possible for admin users to create JWTs for other users as well, so that they can login as another user (for support requests).';
    }

    // get the user roles from the database and add them to the token
    const snap = await db.doc(`tenantSettings/${tenantId}/userPermissions/${requesterUid}`).get();

    const userPermissions = snap.data();

    const additionalClaims = {
      tenantId,
      isAdmin: userPermissions && userPermissions.isAdmin
    };

    console.log("additionalClaims", additionalClaims);

    const customJWt = await auth.createCustomToken(userUid, additionalClaims);

    console.log("Created custom JWT:", customJWt);

    res.status(200).json({customJWt});

  }
  catch(error) {
    console.log("Unexpected error occurred creating custom JWT: ", error);
    res.status(500).json({error});
  }

});



export const apiCreateCustomJwt  = functions.https.onRequest(app);




