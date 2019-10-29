import {Question} from './question.model';


export interface LessonQuestion extends Question {
  courseId:string;
  lessonId:string;
}


export function compareQuestions(q1: LessonQuestion, q2:LessonQuestion) {

  const compareCourses = q1.courseId.localeCompare(q2.courseId);

  if (compareCourses!== 0) return compareCourses;

  const compareLessons = q1.lessonId.localeCompare(q2.lessonId);

  if (compareLessons !== 0) return compareLessons;

  return q2.createdAt.toMillis() - q1.createdAt.toMillis();
}
