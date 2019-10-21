

import * as functions from "firebase-functions";
import {algoliaClient} from './algolia-init';

export const onLessonCreatedUpdateSearchIndex =
  functions.firestore.document('schools/{tenantId}/courses/{courseId}/lessons/{lessonId}')
  .onCreate(async (snap, context) => {

    // Get the lesson document
  const lesson = snap.data();

  // Add an 'objectID' field which Algolia requires
  lesson.objectID = context.params.lessonId;

  // Write to the algolia index
  const index = algoliaClient.initIndex(context.params.tenantId);

  return index.saveObject(lesson);
});
