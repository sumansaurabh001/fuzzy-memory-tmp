import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {CoursesDBService} from '../services/courses-db.service';
import {LessonsDBService} from '../services/lessons-db.service';
import {select, Store} from '@ngrx/store';
import {AppState} from './index';
import {LoadingService} from '../services/loading.service';
import {MessagesService} from '../services/messages.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {SchoolUsersDbService} from '../services/school-users-db.service';
import {TenantService} from '../services/tenant.service';
import {VideoService} from '../services/video.service';
import {LessonActionTypes, UpdateLesson, UpdateLessonOrder, UpdateLessonOrderCompleted, WatchLesson} from './lesson.actions';
import {catchError, concatMap, filter, map, withLatestFrom} from 'rxjs/operators';
import {throwError} from 'rxjs/internal/observable/throwError';
import {isActiveLessonVideoAccessLoaded, selectActiveCourse, selectPendingLessonsReorder} from './selectors';
import {SaveVideoAccess} from './video-access.actions';


@Injectable()
export class LessonEffects {

  @Effect({dispatch: false})
  saveLesson$ = this.actions$
    .pipe(
      ofType<UpdateLesson>(LessonActionTypes.UpdateLesson),
      concatMap(action => this.lessonsDB.saveLesson(action.payload.courseId, action.payload.lesson)),
      catchError(err => {
        this.messages.error('Could not save lesson.');
        return throwError(err);
      })
    );

  @Effect()
  loadUserVideoAccessIfNeeded$ = this.actions$
    .pipe(
      ofType<WatchLesson>(LessonActionTypes.WatchLesson),
      withLatestFrom(
        this.store.pipe(select(isActiveLessonVideoAccessLoaded)),
        this.store.pipe(select(selectActiveCourse)),
      ),
      filter(([action, loaded, course]) => !loaded),
      concatMap(([action,loaded, course]) => this.videos.loadVideoAccess(course.id, action.payload.lessonId) ),
      map(videoAccess => new SaveVideoAccess({videoAccess})),
      catchError(err => {
        this.messages.error('Could not load user video access.');
        return throwError(err);
      })
    );


  @Effect()
  saveLessonReordering$ = this.actions$
    .pipe(
      ofType<UpdateLessonOrder>(LessonActionTypes.UpdateLessonOrder),
      withLatestFrom(this.store.pipe(select(selectPendingLessonsReorder))),
      concatMap(([action, changes]) => this.lessonsDB.updateLessons(action.payload.courseId, changes)),
      map(() => new UpdateLessonOrderCompleted()),
      catchError(err => {
        this.messages.error('Could not save the new lessons order.');
        return throwError(err);
      })
    );


  constructor(private actions$: Actions,
              private coursesDB: CoursesDBService,
              private lessonsDB: LessonsDBService,
              private store: Store<AppState>,
              private loading: LoadingService,
              private messages: MessagesService,
              private afAuth: AngularFireAuth,
              private usersDB: SchoolUsersDbService,
              private tenant: TenantService,
              private videos: VideoService) {

  }


}
