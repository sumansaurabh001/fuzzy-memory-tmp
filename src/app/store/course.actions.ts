import {Action} from '@ngrx/store';
import {Update} from '@ngrx/entity';
import {Course} from '../models/course.model';

export enum CourseActionTypes {
  LoadCourse = '[Course]  Load Course',
  EditCourse = '[Course] Editing Course',
  LoadCourses = '[Course] Load Courses',
  AddCourse = '[Course] Add Course',
  UpsertCourse = '[Course] Upsert Course',
  AddCourses = '[Course] Add Courses',
  UpsertCourses = '[Course] Upsert Courses',
  UpdateCourse = '[Course] Update Course',
  UpdateCourses = '[Course] Update Courses',
  DeleteCourse = '[Course] Delete Course',
  DeleteCourses = '[Course] Delete Courses',
  ClearCourses = '[Course] Clear Courses'
}



export class LoadCourse implements Action {

  readonly type = CourseActionTypes.LoadCourse;

  constructor(public payload: {courseUrl:string}) {

  }
}


export class EditCourse implements Action {

  readonly type = CourseActionTypes.EditCourse;

  constructor(public payload: { editedCourseId: string }) {

  }

}

export class LoadCourses implements Action {
  readonly type = CourseActionTypes.LoadCourses;

  constructor(public payload: { courses: Course[] }) {
  }
}

export class AddCourse implements Action {
  readonly type = CourseActionTypes.AddCourse;

  constructor(public payload: { course: Course }) {
  }
}

export class UpsertCourse implements Action {
  readonly type = CourseActionTypes.UpsertCourse;

  constructor(public payload: { course: Update<Course> }) {
  }
}

export class AddCourses implements Action {
  readonly type = CourseActionTypes.AddCourses;

  constructor(public payload: { courses: Course[] }) {
  }
}

export class UpsertCourses implements Action {
  readonly type = CourseActionTypes.UpsertCourses;

  constructor(public payload: { courses: Update<Course>[] }) {
  }
}

export class UpdateCourse implements Action {
  readonly type = CourseActionTypes.UpdateCourse;

  constructor(public payload: { course: Update<Course> }) {
  }
}

export class UpdateCourses implements Action {
  readonly type = CourseActionTypes.UpdateCourses;

  constructor(public payload: { courses: Update<Course>[] }) {
  }
}

export class DeleteCourse implements Action {
  readonly type = CourseActionTypes.DeleteCourse;

  constructor(public payload: { id: string }) {
  }
}

export class DeleteCourses implements Action {
  readonly type = CourseActionTypes.DeleteCourses;

  constructor(public payload: { ids: string[] }) {
  }
}

export class ClearCourses implements Action {
  readonly type = CourseActionTypes.ClearCourses;
}

export type CourseActions =
   EditCourse
  | LoadCourses
  | AddCourse
  | UpsertCourse
  | AddCourses
  | UpsertCourses
  | UpdateCourse
  | UpdateCourses
  | DeleteCourse
  | DeleteCourses
  | ClearCourses;
