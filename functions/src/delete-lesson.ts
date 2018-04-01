import * as functions from 'firebase-functions';
import {storage} from './init';

const gcs = require('@google-cloud/storage')({keyFilename: __dirname + '/service-account-credentials.json'});


export const onDeleteLesson = functions.firestore
  .document('schools/{tenantId}/courses/{courseId}/lessons/{lessonId}')
  .onDelete(async event => {

    const tenantId = event.params.tenantId,
      courseId = event.params.courseId,
      lessonId = event.params.lessonId;

    const lesson = event.data.previous.data();

    const lessonDirectoryPath = `${tenantId}/${courseId}/videos/${lessonId}`;

    const bucket = gcs.bucket(functions.config().firebase.storageBucket);

    const videoFilePath = `${lessonDirectoryPath}/${lesson.videoFileName}`;

    await bucket.file(videoFilePath).delete();

    const thumbnailFilePath = `${lessonDirectoryPath}/${lesson.thumbnail}`;

    await bucket.file(thumbnailFilePath).delete();

  });
