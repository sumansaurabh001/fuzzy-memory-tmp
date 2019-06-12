import {Actions, createEffect, Effect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {concatMap, filter, map, withLatestFrom} from 'rxjs/operators';
import {AppState} from './index';
import {select, Store} from '@ngrx/store';
import {isActiveCourseLessonsLoaded, selectUser} from './selectors';
import {UserLessonStatusDbService} from '../services/user-lesson-status.db.service';

import {isAnonymousUser} from '../models/user.model';
import {CourseActions, UserLessonStatusActions} from './action-types';
import {userLessonsStatusLoaded} from './user-lesson-status.actions';


@Injectable({
  providedIn: 'root'
})
export class UserLessonStatusEffects {

  loadLessonsWatchedByCourseIfNeeded$ = createEffect(() => this.actions$
    .pipe(
      ofType(CourseActions.loadCourseDetail),
      withLatestFrom(this.store.pipe(select(isActiveCourseLessonsLoaded))),
      filter(([action, loaded]) => !loaded),
      map(([action, loaded]) => action),
      withLatestFrom(this.store.pipe(select(selectUser))),
      filter(([action, user]) => !isAnonymousUser(user)),
      concatMap(([{courseId}, user]) => this.userLessonsDb.loadLessonsWatchedByCourse(user.id, courseId)),
      map(userLessonsStatusList => userLessonsStatusLoaded({userLessonsStatusList}))
    ));

  saveLessonStatus = createEffect(() =>this.actions$
    .pipe(
      ofType(UserLessonStatusActions.updateLessonWatchStatus),
      withLatestFrom(this.store.pipe(select(selectUser))),
      filter(([action, user]) => !isAnonymousUser(user)),
      concatMap(([action, user]) => this.userLessonsDb.saveLessonStatus(user.id, action.userLessonStatus))
    ),
    {dispatch: false});

  constructor(
    private actions$ :Actions,
    private store: Store<AppState>,
    private userLessonsDb: UserLessonStatusDbService) {

  }

}
