import {Action} from '@ngrx/store';
import {UserLessonStatus} from '../models/user-lesson-status';


export enum UserLessonStatusActionTypes {
  UpdateLessonWatchStatus = '[Lessons List] Update Lesson Watch Status',
  UserLessonsStatusLoaded = '[Course Page] Load User Lessons Watched'
}

export class UpdateLessonWatchStatus implements Action {

  readonly type = UserLessonStatusActionTypes.UpdateLessonWatchStatus;

  constructor(public payload: {userLessonStatus: UserLessonStatus}) {}

}


export class UserLessonsStatusLoaded implements Action {

  readonly type = UserLessonStatusActionTypes.UserLessonsStatusLoaded;

  constructor(public payload: {userLessonsStatusList: UserLessonStatus[]}) {}

}


export type UserLessonStatusActions = UpdateLessonWatchStatus | UserLessonsStatusLoaded;
