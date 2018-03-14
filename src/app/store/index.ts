import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromCourse from './course.reducer';
import {routerReducer} from '@ngrx/router-store';
import {RouterReducerState} from '@ngrx/router-store/src/router_store_module';


export interface State {

  courses: fromCourse.State;
  router: RouterReducerState;
}

export const reducers: ActionReducerMap<State> = {

  courses: fromCourse.reducer,
  router: routerReducer

};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];



