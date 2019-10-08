import {createFeatureSelector, createSelector} from '@ngrx/store';
import {LatestLessonsState} from './latest-lessons.reducer';


export const selectLatestLessonsState = createFeatureSelector<LatestLessonsState>("latestLessonsView");


export const selectAllLatestLessons = createSelector(
  selectLatestLessonsState,
  state => state.latestLessons
);

