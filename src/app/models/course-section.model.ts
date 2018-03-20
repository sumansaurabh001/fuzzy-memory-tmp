import {Lesson} from './lesson.model';

export interface CourseSection {
  id:string;
  courseId: string;
  seqNo: number;
  title: string;
  lessons?: Lesson[];
}

