import {createFeatureSelector} from '@ngrx/store';
import {LatestLessonsState} from './latest-lessons.reducer';


export const selectLatestLessonsState = createFeatureSelector<LatestLessonsState>("latestLessonsView");


