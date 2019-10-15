import {createFeatureSelector, createSelector} from '@ngrx/store';
import {LatestLessonsState} from './latest-lessons.reducer';


export const selectLatestLessonsState = createFeatureSelector<LatestLessonsState>("latestLessonsView");


export const selectAllLatestLessons = createSelector(
  selectLatestLessonsState,
  state => state.latestLessons
);


export const isAllLatestLessonsLoaded = createSelector(
  selectLatestLessonsState,
  state => state.allPagesLoaded
);


export const selectLatestLessonsSortOrder = createSelector(
  selectLatestLessonsState,
  state => state.sortOrder
);
