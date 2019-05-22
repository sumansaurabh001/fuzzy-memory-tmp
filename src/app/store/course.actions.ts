import {Action} from '@ngrx/store';
import {Update} from '@ngrx/entity';
import {Course} from '../models/course.model';

export enum CourseActionTypes {
  CourseLoaded = '[Course]  Load Course',
  LoadCourseDetail = '[Course] Load Course Detail',
  LoadCourses = '[Course] Load Courses',
  CreateNewCourse = '[Add Course Dialog] Create New Course',
  UpsertCourse = '[Course] Upsert Course',
  AddCourses = '[Course] Add Courses',
  UpsertCourses = '[Course] Upsert Courses',
  UpdateCourse = '[Course] Update Course',
  UpdateCourses = '[Course] Update Courses',
  DeleteCourse = '[Course] Delete Course',
  DeleteCourses = '[Course] Delete Courses',
  ClearCourses = '[Course] Clear Courses',
  CoursePurchased = '[Course Page] Course Purchased',
  UserCoursesLoaded = '[App Startup] User Courses Loaded',
  UpdateCourseSortOrder = '[Courses Screen] Course Sort Order Updated',
  UpdateCourseSortOrderCompleted = '[Courses Screen] Update Course Sort Order Completed'
}


export class CourseLoaded implements Action {

  readonly type = CourseActionTypes.CourseLoaded;

  constructor(public payload: { course: Course }) {

  }
}


export class LoadCourseDetail implements Action {

  readonly type = CourseActionTypes.LoadCourseDetail;

  constructor(public payload: { courseId: string }) {

  }

}

export class LoadCourses implements Action {
  readonly type = CourseActionTypes.LoadCourses;

  constructor(public payload: { courses: Course[] }) {
  }
}

export class CreateNewCourse implements Action {
  readonly type = CourseActionTypes.CreateNewCourse;

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

export class CoursePurchased implements Action {
  readonly type = CourseActionTypes.CoursePurchased;

  constructor(public payload: {courseId:string}) {}
}

export class UserCoursesLoaded implements Action {
  readonly type = CourseActionTypes.UserCoursesLoaded;

  constructor(public payload: {purchasedCourses:string[]}) {}
}

export class UpdateCourseSortOrder implements Action {
  readonly type = CourseActionTypes.UpdateCourseSortOrder;

  constructor(public payload: {newSortOrder:Course[]}) {}
}

export class UpdateCourseSortOrderCompleted implements Action {

  readonly type = CourseActionTypes.UpdateCourseSortOrderCompleted;

  constructor(){ }
}



export type CourseActions =
   LoadCourseDetail
  | CourseLoaded
  | LoadCourses
  | CreateNewCourse
  | UpsertCourse
  | AddCourses
  | UpsertCourses
  | UpdateCourse
  | UpdateCourses
  | DeleteCourse
  | DeleteCourses
  | ClearCourses
  | CoursePurchased
  | UserCoursesLoaded
  | UpdateCourseSortOrder
  | UpdateCourseSortOrderCompleted;
