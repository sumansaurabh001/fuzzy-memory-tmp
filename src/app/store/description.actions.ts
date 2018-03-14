import { Action } from '@ngrx/store';

export enum DescriptionActionTypes {
  LoadCourseDescription = '[Description] Load Course Description Action',
  AddCourseDescription = '[Description] Add Course Description Action'
}

export class LoadCourseDescription implements Action {

  readonly type = DescriptionActionTypes.LoadCourseDescription;

  constructor(public payload: {courseId:string}) {

  }
}

export class AddCourseDescription implements Action {

  readonly type = DescriptionActionTypes.AddCourseDescription;

  constructor(public payload: {courseId:string, description:string}) {

  }
}


export type DescriptionActions = LoadCourseDescription | AddCourseDescription;


