import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { CourseSection } from '../models/course-section.model';

export enum CourseSectionActionTypes {
  LoadCourseSections = '[CourseSection] Load CourseSections',
  AddCourseSection = '[CourseSection] Add CourseSection',
  UpsertCourseSection = '[CourseSection] Upsert CourseSection',
  AddCourseSections = '[CourseSection] Add CourseSections',
  UpsertCourseSections = '[CourseSection] Upsert CourseSections',
  UpdateCourseSection = '[CourseSection] Update CourseSection',
  UpdateCourseSections = '[CourseSection] Update CourseSections',
  DeleteCourseSection = '[CourseSection] Delete CourseSection',
  DeleteCourseSections = '[CourseSection] Delete CourseSections',
  ClearCourseSections = '[CourseSection] Clear CourseSections'
}

export class LoadCourseSections implements Action {
  readonly type = CourseSectionActionTypes.LoadCourseSections;

  constructor(public payload: { courseSections: CourseSection[] }) {}
}

export class AddCourseSection implements Action {
  readonly type = CourseSectionActionTypes.AddCourseSection;

  constructor(public payload: { courseSection: CourseSection }) {}
}

export class UpsertCourseSection implements Action {
  readonly type = CourseSectionActionTypes.UpsertCourseSection;

  constructor(public payload: { courseSection: Update<CourseSection> }) {}
}

export class AddCourseSections implements Action {
  readonly type = CourseSectionActionTypes.AddCourseSections;

  constructor(public payload: { courseSections: CourseSection[], courseId:string }) {}
}

export class UpsertCourseSections implements Action {
  readonly type = CourseSectionActionTypes.UpsertCourseSections;

  constructor(public payload: { courseSections: Update<CourseSection>[] }) {}
}

export class UpdateCourseSection implements Action {
  readonly type = CourseSectionActionTypes.UpdateCourseSection;

  constructor(public payload: { courseSection: Update<CourseSection> }) {}
}

export class UpdateCourseSections implements Action {
  readonly type = CourseSectionActionTypes.UpdateCourseSections;

  constructor(public payload: { courseSections: Update<CourseSection>[] }) {}
}

export class DeleteCourseSection implements Action {
  readonly type = CourseSectionActionTypes.DeleteCourseSection;

  constructor(public payload: { id: string }) {}
}

export class DeleteCourseSections implements Action {
  readonly type = CourseSectionActionTypes.DeleteCourseSections;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearCourseSections implements Action {
  readonly type = CourseSectionActionTypes.ClearCourseSections;
}

export type CourseSectionActions =
 LoadCourseSections
 | AddCourseSection
 | UpsertCourseSection
 | AddCourseSections
 | UpsertCourseSections
 | UpdateCourseSection
 | UpdateCourseSections
 | DeleteCourseSection
 | DeleteCourseSections
 | ClearCourseSections;
