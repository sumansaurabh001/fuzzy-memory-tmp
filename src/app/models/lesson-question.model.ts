import {Question} from './question.model';


export interface LessonQuestion extends Question {
  courseId:string;
  lessonId:string;
}
