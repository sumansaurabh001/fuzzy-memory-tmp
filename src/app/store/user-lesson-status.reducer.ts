import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {UserLessonStatus} from '../models/user-lesson-status';
import {UserLessonStatusActions, UserLessonStatusActionTypes} from './user-lesson-status.actions';


export interface UserLessonStatusState extends EntityState<UserLessonStatus> {

}

export const adapter: EntityAdapter<UserLessonStatus> = createEntityAdapter<UserLessonStatus>();


export const initialUserLessonStatusState = adapter.getInitialState();


export function userLessonStatusReducer(state = initialUserLessonStatusState, action: UserLessonStatusActions) {
  switch (action.type) {

    case UserLessonStatusActionTypes.UpdateLessonWatchStatus:

      return adapter.upsertOne(action.payload.userLessonStatus, state);

    case UserLessonStatusActionTypes.UserLessonsStatusLoaded:

      return adapter.addMany(action.payload.userLessonsStatusList, state);

    default:
      return state;
  }
}



