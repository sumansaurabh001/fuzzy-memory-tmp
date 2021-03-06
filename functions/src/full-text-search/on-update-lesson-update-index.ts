
import * as functions from "firebase-functions";
import {algoliaClient} from './algolia-init';


export const onLessonUpdatedUpdateSearchIndex =
  functions.firestore.document('schools/{tenantId}/courses/{courseId}/lessons/{lessonId}')
    .onUpdate(async(change, context) => {

      const newData = change.after.data(),
            oldData = change.before.data(),
           objectID = context.params.lessonId;

      const index = algoliaClient.initIndex(context.params.tenantId + "_lessons");

      if (oldData.status == "published" && newData.status == "draft") {
        return index.deleteObject(objectID);
      }
      else return index.saveObject({
        title: newData.title,
        courseId: context.params.courseId,
        sectionId: newData.sectionId,
        seqNo: newData.seqNo,
        objectID
      });
  });
