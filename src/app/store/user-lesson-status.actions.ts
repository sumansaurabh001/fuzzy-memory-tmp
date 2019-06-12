import {Action, createAction, props} from '@ngrx/store';
import {UserLessonStatus} from '../models/user-lesson-status';




export const updateLessonWatchStatus = createAction(
  '[Lessons List] Update Lesson Watch Status',
  props<{userLessonStatus: UserLessonStatus}>()
);


export const userLessonsStatusLoaded = createAction(
  '[Course Page] Load User Lessons Watched',
  props<{userLessonsStatusList: UserLessonStatus[]}>()
);

