import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {UserLessonStatus} from '../models/user-lesson-status';
import {createReducer, on} from '@ngrx/store';
import {UserLessonStatusActions} from './action-types';


export interface UserLessonStatusState extends EntityState<UserLessonStatus> {
  coursesLoaded: string[];
}

export const adapter: EntityAdapter<UserLessonStatus> = createEntityAdapter<UserLessonStatus>();


export const initialUserLessonStatusState = adapter.getInitialState({
  coursesLoaded: []
});


export const userLessonStatusReducer = createReducer(
  initialUserLessonStatusState,

  on(UserLessonStatusActions.updateLessonWatchStatus, (state, action) => adapter.upsertOne(action.userLessonStatus, state)),

  on(UserLessonStatusActions.userLessonsStatusLoaded, (state, action) => {
    return adapter.addMany(action.userLessonsStatusList, {
      ...state,
      coursesLoaded: state.coursesLoaded.concat(action.courseId)
    });
  })

);




