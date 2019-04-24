import * as functions from 'firebase-functions';
import {authenticationMiddleware} from './api-authentication.middleware';
import {getDocData} from './utils';
import {db} from './init';


const request = require('request-promise');
const express = require('express');
const cors = require('cors');


const app = express();

// Automatically allow cross-origin requests
app.use(cors({origin: true}));

// only a signed-in user can purchase courses
app.use(authenticationMiddleware);


app.post('/confirm-course-purchased', async (req, res) => {

  try {

    const courseId = req.body.courseId,
      userId = req.user.uid,
      tenantId = req.body.tenantId,
      ongoingPurchaseSessionId = req.body.ongoingPurchaseSessionId;

    // get the ongoing purchase session
    const purchaseSessionPath = `schools/${tenantId}/purchaseSessions/${userId}`;

    const session = await getDocData(purchaseSessionPath);

    // check if the purchase is confirmed
    if (session && session.courseId == courseId && session.ongoingPurchaseSessionId == ongoingPurchaseSessionId) {

      // add the course to the user's list of purchased courses
      const usersPrivatePath = `schools/${tenantId}/usersPrivate/${userId}`;

      let userPrivate = await getDocData(usersPrivatePath);

      if (!userPrivate || !userPrivate.purchasedCourses) {
        userPrivate = {
          purchasedCourses: []
        };
      }

      userPrivate.purchasedCourses.push(courseId);

      await db.doc(usersPrivatePath).set(userPrivate, {merge: true});

      await db.doc(purchaseSessionPath).delete();

      res.status(200).json({message: 'Course purchase confirmed successfully.'});

    }
    else {
      res.status(500).json({message:'Could not confirm course purchase.'});
    }

  }
  catch (error) {
    console.log('Unexpected error occurred while confirming course purchase: ', error);
    res.status(500).json({error});
  }

});


export const apiConfirmCoursePurchased = functions.https.onRequest(app);



