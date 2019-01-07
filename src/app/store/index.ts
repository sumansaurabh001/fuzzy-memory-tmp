import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromCourse from './course.reducer';
import {routerReducer} from '@ngrx/router-store';
import {RouterReducerState} from '@ngrx/router-store';
import * as fromDescriptions from './descriptions.reducer';
import * as fromCourseSection from './course-section.reducer';
import {storeFreeze} from 'ngrx-store-freeze';
import * as fromLesson from './lesson.reducer';
import {authReducer, AuthState} from './auth.reducer';
import {platformReducer, PlatformState} from './platform.reducer';
import {couponsReducer, CouponsState} from './coupons.reducer';



export interface AppState {
  courses: fromCourse.State;
  router: RouterReducerState;
  descriptions: fromDescriptions.State;
  sections: fromCourseSection.State;
  lessons: fromLesson.State;
  auth: AuthState;
  platform: PlatformState;
  coupons: CouponsState;
}



export const reducers: ActionReducerMap<AppState> = {
  courses: fromCourse.reducer,
  router: routerReducer,
  descriptions: fromDescriptions.reducer,
  sections: fromCourseSection.reducer,
  lessons: fromLesson.reducer,
  auth: authReducer,
  platform: platformReducer,
  coupons: couponsReducer
};



export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [storeFreeze] : [];




