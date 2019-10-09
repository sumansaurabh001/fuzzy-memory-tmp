import {LatestLesson} from '../models/latest-lesson.model';
import {createReducer, on} from '@ngrx/store';
import {LatestLessonActions, LessonActions} from './action-types';


export interface LatestLessonsState {
  latestLessons: LatestLesson[];
  lastPageLoaded:number;
  allPagesLoaded: boolean;
}

export const initialLatestLessonsState: LatestLessonsState = {
  latestLessons: [],
  lastPageLoaded: null,
  allPagesLoaded: false
};

export const latestLessonsReducer = createReducer(
  initialLatestLessonsState,

  on(LatestLessonActions.latestLessonsPageLoaded, (state, action) => {
    return {
      ...state,
      lastPageLoaded: state.lastPageLoaded + 1,
      latestLessons: state.latestLessons.concat(action.latestLessons),
      allPagesLoaded: action.latestLessons.length == 0
    }
  }),

  on(LessonActions.updateLesson, (state, action) => {
    return {
     ...initialLatestLessonsState,
    }
  })


);
