import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromCourse from './course.reducer';


export interface State {

  courses: fromCourse.State;
}

export const reducers: ActionReducerMap<State> = {

  courses: fromCourse.reducer

};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];


