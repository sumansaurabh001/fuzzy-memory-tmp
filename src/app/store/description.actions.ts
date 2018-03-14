import { Action } from '@ngrx/store';

export enum DescriptionActionTypes {
  LoadCourseDescription = '[Description] Load course Description Action'
}

export class LoadCourseDescription implements Action {

  readonly type = DescriptionActionTypes.LoadCourseDescription;

  constructor(public payload: {courseId:string}) {

  }
}

export type DescriptionActions = LoadCourseDescription;


