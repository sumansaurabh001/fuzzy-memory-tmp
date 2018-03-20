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
import * as fromCourseSection from './course-section.reducer';
import {storeFreeze} from 'ngrx-store-freeze';
import * as fromLesson from '../reducers/lesson.reducer';


export interface State {
  courses: fromCourse.State;
  router: RouterReducerState;
  descriptions: fromDescriptions.State;
  sections: fromCourseSection.State;
  lessons: fromLesson.State;

}

export const reducers: ActionReducerMap<State> = {
  courses: fromCourse.reducer,
  router: routerReducer,
  descriptions: fromDescriptions.reducer,
  sections: fromCourseSection.reducer,
  lessons: fromLesson.reducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [storeFreeze] : [];



