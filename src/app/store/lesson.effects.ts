import {Injectable} from '@angular/core';
import {Actions, createEffect, Effect, ofType} from '@ngrx/effects';
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
import {updateLesson, updateLessonOrder, updateLessonOrderCompleted, watchLesson} from './lesson.actions';
import {catchError, concatMap, filter, map, withLatestFrom} from 'rxjs/operators';
import {throwError} from 'rxjs/internal/observable/throwError';
import {isActiveLessonVideoAccessLoaded, selectActiveCourse, selectPendingLessonsReorder} from './selectors';
import {saveVideoAccess} from './video-access.actions';
import {LessonActions} from './action-types';


@Injectable()
export class LessonEffects {

  saveLesson$ = createEffect(() => this.actions$
    .pipe(
      ofType(LessonActions.updateLesson),
      concatMap(action => this.lessonsDB.saveLesson(action.courseId, action.lesson)),
      catchError(err => {
        this.messages.error('Could not save lesson.');
        return throwError(err);
      })
    ),
    {dispatch: false});


  loadUserVideoAccessIfNeeded$ = createEffect(() => this.actions$
    .pipe(
      ofType(LessonActions.watchLesson),
      withLatestFrom(
        this.store.pipe(select(isActiveLessonVideoAccessLoaded)),
        this.store.pipe(select(selectActiveCourse)),
      ),
      filter(([action, loaded, course]) => !loaded),
      concatMap(([action,loaded, course]) => this.videos.loadVideoAccess(course.id, action.lessonId) ),
      map(videoAccess => saveVideoAccess({videoAccess})),
      catchError(err => {
        this.messages.error('Could not load user video access.');
        return throwError(err);
      })
    ));

  saveLessonReordering$ = createEffect( ()=> this.actions$
    .pipe(
      ofType(LessonActions.updateLessonOrder),
      withLatestFrom(this.store.pipe(select(selectPendingLessonsReorder))),
      concatMap(([action, changes]) => this.lessonsDB.updateLessons(action.courseId, changes)),
      map(() => updateLessonOrderCompleted()),
      catchError(err => {
        this.messages.error('Could not save the new lessons order.');
        return throwError(err);
      })
    ));


  publishLesson$ = this.createLessonStatusEffect(LessonActions.publishLesson, 'published');

  unpublishLesson$ = this.createLessonStatusEffect(LessonActions.unpublishLesson, 'ready');



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

  createLessonStatusEffect(actionType, newStatus:string) {
    return createEffect(() => this.actions$
        .pipe(
          ofType(actionType),
          concatMap((action:any) => this.lessonsDB.saveLesson(action.courseId, <any>{
            id: action.lessonId,
            changes: {
              status: newStatus
            }
          })),
          catchError(err => {
            this.messages.error('Could not update lesson status.');
            return throwError(err);
          })
        ),
      {dispatch: false});

  }


}


