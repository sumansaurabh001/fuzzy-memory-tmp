import {Question} from './question.model';


export interface LessonQuestion extends Question {
  courseId:string;
  lessonId:string;
}


export function compareQuestions(q1: LessonQuestion, q2:LessonQuestion) {
  return q2.createdAt.toMillis() - q1.createdAt.toMillis();
}
