import * as functions from 'firebase-functions';
import {getDocData} from './utils';
import {getUserMiddleware} from './api-get-user.middleware';


const express = require('express');
const cors = require('cors');


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

async function handleAuthenticatedUser(req, res, reqInfo:RequestInfo, video) {
  if (req.user.isAdmin) {
    console.log('Granting video access to admin user.');
    allowVideoAccess(res, reqInfo, video);
    return;
  }

  const userCourses = await getDocData(`schools/${reqInfo.tenantId}/userCourses/${reqInfo.userId}`);

  if (userCourses && userCourses.purchasedCourses.includes(reqInfo.courseId)) {
    console.log('Granting video access to premium user.');
    allowVideoAccess(res, reqInfo, video);
  }
  else {
    denyVideoAccess(res, reqInfo);
  }
}


function allowVideoAccess(res, reqInfo: RequestInfo, video) {
  console.log("Granting access to video:", JSON.stringify(video));
  res.status(200).json({id: reqInfo.lessonId, status:'allowed', videoSecretFileName: video.secretVideoFileName});
}

function denyVideoAccess(res, reqInfo: RequestInfo) {
  res.status(200).json({id: reqInfo.lessonId, status:'denied'});
}


export const apiVideoAccess = functions.https.onRequest(app);
