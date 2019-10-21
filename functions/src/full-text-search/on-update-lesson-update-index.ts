
import * as functions from "firebase-functions";
import {algoliaClient} from './algolia-init';


export const onLessonUpdatedUpdateSearchIndex =
  functions.firestore.document('schools/{tenantId}/courses/{courseId}/lessons/{lessonId}')
    .onUpdate(async(change, context) => {

      const newData = change.after.data(),
            oldData = change.before.data(),
           objectID = context.params.lessonId;

      const index = algoliaClient.initIndex(context.params.tenantId);

      if (oldData.status == "published" && newData.status == "draft") {
        return index.deleteObject(objectID);
      }
      else return index.saveObject({ ...newData, objectID });
  });
