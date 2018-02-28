import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromCourse from './course.reducer';

export interface AppState {

  courses: fromCourse.State;
}

export const reducers: ActionReducerMap<AppState> = {

  courses: fromCourse.reducer,
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
