import * as functions from 'firebase-functions';
import {authenticationMiddleware} from './api-authentication.middleware';
import {auth, db} from './init';
import {getDocData} from './utils';


const express = require('express');
const cors = require('cors');


const app = express();

// Automatically allow cross-origin requests
app.use(cors({origin: true}));


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

  const tenantId = req.query.tenantId,
    courseId = req.query.courseId,
    lessonId = req.query.lessonId,
    userId = req.user? req.user.uid : undefined;


  try {




    res.status(200).json({id: lessonId, status:'denied'});

  }
  catch (error) {
    console.log('Unexpected error occurred while loading course videos: ', error);
    res.status(500).json({error});
  }

});


export const apiVideoAccess = functions.https.onRequest(app);
