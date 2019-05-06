import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { CourseSection } from '../models/course-section.model';

export enum CourseSectionActionTypes {
  LoadCourseSections = '[CourseSection] Load Course Sections',
  AddCourseSection = '[CourseSection] Add Course Section',
  AddCourseSections = '[CourseSection] Add Course Sections',
  UpdateCourseSection = '[CourseSection] Update Course Section',
  DeleteCourseSection = '[CourseSection] Delete Course Section'
}

export class LoadCourseSections implements Action {
  readonly type = CourseSectionActionTypes.LoadCourseSections;

  constructor(public payload: { courseSections: CourseSection[] }) {}
}

export class AddCourseSection implements Action {
  readonly type = CourseSectionActionTypes.AddCourseSection;

  constructor(public payload: { courseSection: CourseSection }) {}
}


export class AddCourseSections implements Action {
  readonly type = CourseSectionActionTypes.AddCourseSections;

  constructor(public payload: { courseSections: CourseSection[], courseId:string }) {}
}

export class UpdateCourseSection implements Action {
  readonly type = CourseSectionActionTypes.UpdateCourseSection;

  constructor(public payload: { courseSection: Update<CourseSection> }) {}
}

export class DeleteCourseSection implements Action {
  readonly type = CourseSectionActionTypes.DeleteCourseSection;

  constructor(public payload: { id: string }) {}
}

export type CourseSectionActions =
 LoadCourseSections
 | AddCourseSection
 | AddCourseSections
 | UpdateCourseSection
 | DeleteCourseSection;
