import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromCourse from './course.reducer';
import {routerReducer} from '@ngrx/router-store';
import {RouterReducerState} from '@ngrx/router-store/src/router_store_module';
import * as fromDescriptions from './descriptions.reducer';


export interface State {
  courses: fromCourse.State;
  router: RouterReducerState;
  descriptions: fromDescriptions.State;

}

export const reducers: ActionReducerMap<State> = {
  courses: fromCourse.reducer,
  router: routerReducer,
  descriptions: fromDescriptions.reducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];



