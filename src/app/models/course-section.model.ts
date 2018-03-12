import {Lesson} from './lesson.model';

export interface CourseSection {
  id:string;
  seqNo: number;
  title: string;
  lessons: Lesson[];
}

