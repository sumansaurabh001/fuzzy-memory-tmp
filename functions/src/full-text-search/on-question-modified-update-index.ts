
import * as functions from "firebase-functions";
import {algoliaClient} from './algolia-init';


export const onQuestionCreatedUpdateIndex =
  functions.firestore.document('schools/{tenantId}/courses/{courseId}/questions/{questionId}')
  .onCreate((snapshot,context) => {

    const question = snapshot.data(),
          tenantId = context.params.tenantId,
          courseId = context.params.courseId,
          objectID = snapshot.id;

    const indexName = calculateQuestionsIndexName(tenantId, courseId);

    const index = algoliaClient.initIndex(indexName);

    return index.saveObject({
      title: question.title,
      text: question.questionText,
      courseId,
      lessonId: question.lessonId,
      objectID
    });

  });


export const onQuestionUpdatedUpdateIndex =
  functions.firestore.document('schools/{tenantId}/courses/{courseId}/questions/{questionId}')
    .onUpdate((change,context) => {

      const question = change.after.data(),
        tenantId = context.params.tenantId,
        courseId = context.params.courseId,
        objectID = change.after.id;

      const indexName = calculateQuestionsIndexName(tenantId, courseId);

      const index = algoliaClient.initIndex(indexName);

      return index.saveObject({
        title: question.title,
        text: question.questionText,
        courseId,
        lessonId: question.lessonId,
        objectID
      });

    });


export const onQuestionDeletedUpdateIndex =
  functions.firestore.document('schools/{tenantId}/courses/{courseId}/questions/{questionId}')
    .onDelete((snap,context) => {

      const question = snap.data(),
        tenantId = context.params.tenantId,
        courseId = context.params.courseId,
        objectID = snap.id;

      const indexName = calculateQuestionsIndexName(tenantId, courseId);

      const index = algoliaClient.initIndex(indexName);

      return index.deleteObject(objectID);

    });


function calculateQuestionsIndexName(tenantId:string, courseId:string) {
  return `${tenantId}_${courseId}_questions_and_answers`
}
