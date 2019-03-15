import * as functions from 'firebase-functions';
import {getDocData} from './utils';
import {getUserMiddleware} from './api-get-user.middleware';


const express = require('express');
const cors = require('cors');
const firebase = require('firebase-admin');
import * as dayjs from "dayjs";

const app = express();

// Automatically allow cross-origin requests
app.use(cors({origin: true}));

// retrieve the user info from the request, if available
app.use(getUserMiddleware);


interface RequestInfo {
  tenantId:string;
  courseId:string;
  lessonId:string;
  userId:string;
  claims: Object;
}

/**
 *
 * For a given course lesson, this service will return the secret video file name, but only if the user has access to the video.
 *
 * The goal here is to ensure that only users that bought the course, subscribers or ADMIN users will be able to watch premium videos.
 *
 * On the other hand, free videos should be watchable by anyone, including free users and unauthenticated users.
 *
 * Note that the video file name cannot be read directly by the frontend, and so we need this cloud function.
 *
 */

app.get('/video-access', async (req, res) => {

  const reqInfo: RequestInfo = {
    tenantId: req.query.tenantId,
    courseId:req.query.courseId,
    lessonId:req.query.lessonId,
    userId:req.user? req.user.uid : undefined,
    claims: req.user? req.user.claims : undefined
  };

  try {

    console.log("Checking if user has access to to video, user data:", JSON.stringify(req.user));

    const lesson = await getDocData(`schools/${reqInfo.tenantId}/courses/${reqInfo.courseId}/lessons/${reqInfo.lessonId}`);

    const video = await getDocData(`schools/${reqInfo.tenantId}/courses/${reqInfo.courseId}/videos/${reqInfo.lessonId}`);

    if (lesson.free) {
      allowVideoAccess(res, reqInfo, video);
    }
    else if (reqInfo.userId) {
      await handleAuthenticatedUser(req, res, reqInfo, video);
    }
    else {
      denyVideoAccess(res, reqInfo);
    }

  }
  catch (error) {
    console.log('Unexpected error occurred while loading course videos: ', error);
    res.status(500).json({error});
  }

});


/*
*
* The user can only access the premium video if:
 *
 *  - its a free video
 *  - the user is a premium subscriber
 *  - the user bought the course separately
*
*/

async function handleAuthenticatedUser(req, res, reqInfo:RequestInfo, video) {
  if (req.user.isAdmin) {
    console.log('Granting video access to admin user.');
    allowVideoAccess(res, reqInfo, video);
    return;
  }

  const userPrivate = await getDocData(`schools/${reqInfo.tenantId}/usersPrivate/${reqInfo.userId}`);

  if (isSubscriptionActive(userPrivate)) {
    console.log('Granting video access to subscribed user.');
    allowVideoAccess(res, reqInfo, video);
    return;
  }

  if (userPrivate && userPrivate.purchasedCourses && userPrivate.purchasedCourses.includes(reqInfo.courseId)) {
    console.log('Granting video access to premium user.');
    allowVideoAccess(res, reqInfo, video);
    return;
  }

  denyVideoAccess(res, reqInfo);

}

function isSubscriptionActive(user) {

  if (!user.pricingPlan) {
    return false;
  }

  // Lifetime plan
  if (user.pricingPlan == 'forever') {
    return true;
  }

  // ongoing subscription
  if (!user.planEndsAt) {
    return true;
  }

  // cancelled subscription, before end period
  if (user.planEndsAt) {

    const subscriptionEnd = dayjs(user.planEndsAt);

    const now = dayjs();

    return subscriptionEnd.isAfter(now);

  }

  return false;

}


function allowVideoAccess(res, reqInfo: RequestInfo, video) {
  console.log("Granting access to video:", JSON.stringify(video));
  res.status(200).json({
    id: reqInfo.lessonId,
    courseId: reqInfo.courseId,
    status:'allowed',
    videoSecretFileName: video.secretVideoFileName
  });
}

function denyVideoAccess(res, reqInfo: RequestInfo) {
  res.status(200).json({
    id: reqInfo.lessonId,
    status:'denied',
    courseId: reqInfo.courseId
  });
}


export const apiVideoAccess = functions.https.onRequest(app);
