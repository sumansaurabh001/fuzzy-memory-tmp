import * as functions from 'firebase-functions';
import {getDocData} from './utils';
import {db} from './init';

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

    // delete latest lessons view entry
    const latestLessonPath = `schools/${tenantId}/latestLessonsView/${lessonId}`;

    await db.doc(latestLessonPath).delete();

    const lessonDirectoryPath = `${tenantId}/${courseId}/videos/${lessonId}`;

    const bucket = gcs.bucket(adminConfig.storageBucket);

    // get the video file name from the DB
    const videoPath = `schools/${tenantId}/courses/${courseId}/videos/${lessonId}`;

    const video = await getDocData(videoPath);

    const videoFilePath = `${lessonDirectoryPath}/${video.secretVideoName}`;

    if (video.secretVideoName) {
      console.log("deleting video file from storage path: " + videoFilePath);
      await bucket.file(videoFilePath).delete();
    }

    if (video.thumbnailFileName) {
      console.log("deleting video thumbnail from storage path: " + videoFilePath);
      const thumbnailFilePath = `${lessonDirectoryPath}/${video.thumbnailFileName}`;
      await bucket.file(thumbnailFilePath).delete();
    }

    console.log("deleting video details from DB");

    await db.doc(videoPath).delete();

  });
