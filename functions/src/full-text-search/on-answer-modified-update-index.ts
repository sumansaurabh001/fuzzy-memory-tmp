
import * as functions from "firebase-functions";
import {algoliaClient} from './algolia-init';
import {calculateQuestionsIndexName} from './calculateQuestionsIndexName';


export const onAnswerCreatedUpdateIndex =
  functions.firestore.document('schools/{tenantId}/courses/{courseId}/questions/{questionId}/answers/{answerId}')
  .onCreate((snapshot,context) => {

    const answer = snapshot.data(),
          tenantId = context.params.tenantId,
          courseId = context.params.courseId,
          objectID = snapshot.id;

    const indexName = calculateQuestionsIndexName(tenantId, courseId);

    const index = algoliaClient.initIndex(indexName);

    return index.saveObject({
      text: answer.answerText,
      courseId,
      lessonId: answer.lessonId,
      objectID
    });

  });


export const onAnswerUpdatedUpdateIndex =
  functions.firestore.document('schools/{tenantId}/courses/{courseId}/questions/{questionId}/answers/{answerId}')
    .onUpdate((change,context) => {

      const answer = change.after.data(),
        tenantId = context.params.tenantId,
        courseId = context.params.courseId,
        objectID = change.after.id;

      const indexName = calculateQuestionsIndexName(tenantId, courseId);

      const index = algoliaClient.initIndex(indexName);

      return index.saveObject({
        text: answer.answerText,
        courseId,
        lessonId: answer.lessonId,
        objectID
      });

    });


export const onAnswerDeletedUpdateIndex =
  functions.firestore.document('schools/{tenantId}/courses/{courseId}/questions/{questionId}/answers/{answerId}')
    .onDelete((snap,context) => {

      const tenantId = context.params.tenantId,
        courseId = context.params.courseId,
        objectID = snap.id;

      const indexName = calculateQuestionsIndexName(tenantId, courseId);

      const index = algoliaClient.initIndex(indexName);

      return index.deleteObject(objectID);

    });


