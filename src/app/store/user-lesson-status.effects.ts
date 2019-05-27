import {Actions, Effect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {UpdateLessonWatchStatus, UserLessonsStatusLoaded, UserLessonStatusActionTypes} from './user-lesson-status.actions';
import {concatMap, filter, map, withLatestFrom} from 'rxjs/operators';
import {AppState} from './index';
import {select, Store} from '@ngrx/store';
import {isActiveCourseLessonsLoaded, selectUser} from './selectors';
import {UserLessonStatusDbService} from '../services/user-lesson-status.db.service';
import {CourseActionTypes, LoadCourseDetail} from './course.actions';
import {isAnonymousUser} from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserLessonStatusEffects {

  @Effect()
  loadLessonsWatchedByCourseIfNeeded$ = this.actions$
    .pipe(
      ofType<LoadCourseDetail>(CourseActionTypes.LoadCourseDetail),
      withLatestFrom(this.store.pipe(select(isActiveCourseLessonsLoaded))),
      filter(([action, loaded]) => !loaded),
      map(([action, loaded]) => action),
      withLatestFrom(this.store.pipe(select(selectUser))),
      filter(([action, user]) => !isAnonymousUser(user)),
      concatMap(([action, user]) => this.userLessonsDb.loadLessonsWatchedByCourse(user.id, action.payload.courseId)),
      map(userLessonsStatusList => new UserLessonsStatusLoaded({userLessonsStatusList}))
    );


  @Effect({dispatch:false})
  saveLessonStatus = this.actions$
    .pipe(
      ofType<UpdateLessonWatchStatus>(UserLessonStatusActionTypes.UpdateLessonWatchStatus),
      withLatestFrom(this.store.pipe(select(selectUser))),
      filter(([action, user]) => !isAnonymousUser(user)),
      concatMap(([action, user]) => this.userLessonsDb.saveLessonStatus(user.id, action.payload.userLessonStatus))
    );


  constructor(
    private actions$ :Actions,
    private store: Store<AppState>,
    private userLessonsDb: UserLessonStatusDbService) {

  }

}
