import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { CourseSection } from '../models/course-section.model';

export enum CourseSectionActionTypes {
  LoadCourseSections = '[CourseSection] Load Course Sections',
  AddCourseSection = '[CourseSection] Add Course Section',
  CourseSectionsLoaded = '[Course Effects] Course Sections Loaded',
  UpdateCourseSection = '[CourseSection] Update Course Section',
  DeleteCourseSection = '[CourseSection] Delete Course Section',
  UpdatedSectionOrder = '[Edit Lessons Screen] Updated Section Order',
  UpdatedSectionOrderCompleted = '[Edit Lessons Screen] Updated Section Order Completed'

}

export class LoadCourseSections implements Action {
  readonly type = CourseSectionActionTypes.LoadCourseSections;

  constructor(public payload: { courseSections: CourseSection[] }) {}
}

export class AddCourseSection implements Action {
  readonly type = CourseSectionActionTypes.AddCourseSection;

  constructor(public payload: { courseSection: CourseSection }) {}
}

export class CourseSectionsLoaded implements Action {
  readonly type = CourseSectionActionTypes.CourseSectionsLoaded;

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

export class UpdateSectionOrder implements Action {

  readonly type = CourseSectionActionTypes.UpdatedSectionOrder;

  constructor(public payload: {courseId:string, newSortOrder: CourseSection[]}) {}

}

export class UpdateSectionOrderCompleted implements Action {

  readonly  type = CourseSectionActionTypes.UpdatedSectionOrderCompleted;

  constructor() {}

}

export type CourseSectionActions =
 LoadCourseSections
 | AddCourseSection
 | CourseSectionsLoaded
 | UpdateCourseSection
 | DeleteCourseSection
 | UpdateSectionOrder
 | UpdateSectionOrderCompleted;
