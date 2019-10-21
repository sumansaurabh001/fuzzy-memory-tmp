
import * as functions from "firebase-functions";
import {algoliaClient} from './algolia-init';


export const onLessonDeletedUpdateSearchIndex =
  functions.firestore.document('schools/{tenantId}/courses/{courseId}/lessons/{lessonId}')
  .onDelete(async (snapshot, context) => {

    const index = algoliaClient.initIndex(context.params.tenantId);

    return index.deleteObject(context.params.lessonId);
  });
