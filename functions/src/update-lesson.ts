import * as functions from 'firebase-functions';
import {getDocData} from './utils';
import {db} from './init';
import * as admin from "firebase-admin";


/**
 *
 * Trigger to keep the latest lessons view in sync with the lessons data.
 *
 **/

export const onUpdateLessonUpdateLatestLessonsView = functions.firestore
  .document('schools/{tenantId}/courses/{courseId}/lessons/{lessonId}')
  .onUpdate(async (snap, context) => {

    const tenantId = context.params.tenantId,
      courseId = context.params.courseId,
      lessonId = context.params.lessonId;

    const lessonAfter = snap.after.data(),
      lessonBefore = snap.before.data();

    const latestLessonPath = `schools/${tenantId}/latestLessonsView/${lessonId}`;

    const isUnpublished = lessonBefore.status == "published" && lessonAfter.status == "draft";

    // delete unpublished lessons from the latest lessons view
    if (isUnpublished) {
      console.log("Deleting lessons from latest lessons view");
      await db.doc(latestLessonPath).delete();
    }
    // only update the latest lessons view if the lesson is already published
    else if (lessonAfter.status == "published") {
      console.log("Updating lesson in latest lessons view");

      await db.doc(latestLessonPath).set({
          courseId,
          sectionId: lessonAfter.sectionId,
          seqNo: lessonAfter.seqNo,
          title: lessonAfter.title,
          videoDuration: lessonAfter.videoDuration,
          free: lessonAfter.free,
          lastUpdated:  admin.firestore.Timestamp.fromDate(new Date())
        },
        {merge:true});
    }

  });

