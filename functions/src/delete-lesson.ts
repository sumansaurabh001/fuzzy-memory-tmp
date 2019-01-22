import * as functions from 'firebase-functions';
import {getDocData} from './utils';

const {Storage} = require('@google-cloud/storage');

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);

/*
*
*  When a lesson is deleted from the database, deleted also any files associated to it:
*  thumbnails, video files, etc.
*
*/

const gcs = new Storage();

export const onDeleteLesson = functions.firestore
  .document('schools/{tenantId}/courses/{courseId}/lessons/{lessonId}')
  .onDelete(async (snap, context) => {

    const tenantId = context.params.tenantId,
      courseId = context.params.courseId,
      lessonId = context.params.lessonId;

    const lesson = snap.data();

    const lessonDirectoryPath = `${tenantId}/${courseId}/videos/${lessonId}`;

    const bucket = gcs.bucket(adminConfig.storageBucket);

    // get the video file name from the DB
    const video = await getDocData(`schools/${tenantId}/courses/${courseId}/videos/${lessonId}`);

    const videoFilePath = `${lessonDirectoryPath}/${video.secretVideoName}`;

    await bucket.file(videoFilePath).delete();

    const thumbnailFilePath = `${lessonDirectoryPath}/${lesson.thumbnail}`;

    await bucket.file(thumbnailFilePath).delete();

  });
