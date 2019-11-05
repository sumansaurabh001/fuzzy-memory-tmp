
import * as firebase from 'firebase/app';

export interface Answer {
  id:string;
  questionId:string;
  courseId:string;
  lessonId:string;
  answerText:string;
  userDisplayName:string;
  userPictureUrl:string;
  createdAt?:firebase.firestore.Timestamp;
}



export function compareAnswers(a1: Answer, a2:Answer) {

  const compareCourses = a1.courseId.localeCompare(a2.courseId);

  if (compareCourses!== 0) return compareCourses;

  const compareLessons = a1.lessonId.localeCompare(a2.lessonId);

  if (compareLessons !== 0) return compareLessons;

  return a2.createdAt.toMillis() - a1.createdAt.toMillis();
}
