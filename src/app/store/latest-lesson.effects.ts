import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {LatestLessonActions} from './action-types';
import {concatMap, filter, map, mergeMap, tap, withLatestFrom} from 'rxjs/operators';
import {LatestLessonsDbService} from '../services/latest-lessons-db.service';
import {changeLatestLessonsSortOrder, latestLessonsPageLoaded} from './latest-lesson.actions';
import {AppState} from './index';
import {select, Store} from '@ngrx/store';
import {selectLatestLessonsState} from './latest-lessons.selectors';
import {LoadingService} from '../services/loading.service';
import {UserLessonStatusDbService} from '../services/user-lesson-status.db.service';
import {from} from "rxjs";
import {selectAllCourses, selectAllLessons, selectAllSections, selectUser} from './selectors';
import {userLessonsStatusLoaded} from './user-lesson-status.actions';
import {selectCoursesWithLessonViewedStatusLoaded} from './user-lesson-status.selectors';
import {Router} from '@angular/router';
import {LessonsDBService} from '../services/lessons-db.service';

@Injectable()
export class LatestLessonEffects {

  loadLatestLessons$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(LatestLessonActions.loadNextLatestLessonsPage, LatestLessonActions.changeLatestLessonsSortOrder),
        withLatestFrom(this.store.pipe(select(selectLatestLessonsState))),
        concatMap(([action, state]) =>
            this.loading.showLoaderUntilCompleted(
              this.latestLessonsDB.loadLatestLessonsPage(
                state.latestLessons.length ? state.latestLessons[state.latestLessons.length -1].lastUpdated : null,
                state.sortOrder)
            )
        ),
        map(latestLessons => latestLessonsPageLoaded({latestLessons})))
  );

  loadLatestLessonsViewedStatusIfNeeded$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(LatestLessonActions.latestLessonsPageLoaded),
        concatMap(action =>  {

          const courseIds = action.latestLessons.map(lesson => lesson.courseId);

          const uniqueCourseIds:string[] = [...new Set(courseIds)];

          return from(uniqueCourseIds)
        }),
        withLatestFrom(this.store.pipe(select(selectCoursesWithLessonViewedStatusLoaded))),
        filter( ([courseId, coursesLoaded]) => !coursesLoaded.find(id => id == courseId) ),
        map(([courseId]) => courseId),
        withLatestFrom(this.store.pipe(select(selectUser))),
        mergeMap(([courseId, user]) =>
          this.userLessonsDb.loadLessonsWatchedByCourse(user.id, courseId)
            .pipe(
              map(userLessonsStatusList => [courseId, userLessonsStatusList])
            )
        ),
        map(([courseId, userLessonsStatusList]:any) => userLessonsStatusLoaded({courseId, userLessonsStatusList}))
      )
  );

  navigateToLesson$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(LatestLessonActions.navigateToLesson),
        withLatestFrom(
          this.store.pipe(select(selectAllCourses))
        ),
        concatMap(([action, courses]) =>
          this.loading.showLoaderUntilCompleted(this.lessonsDB.loadCourseSection(action.courseId, action.sectionId))
            .pipe(
              map(section => [action, courses, section])
            )
        ),
        map(([action, courses, section]:any) => {

          const course = courses.find(course => course.id == action.courseId);

          this.router.navigateByUrl(`/courses/${course.url}/${section.seqNo}/lessons/${action.seqNo}`);

        })
      )
  ,{dispatch:false});


  constructor(
    private actions$ : Actions,
    private latestLessonsDB: LatestLessonsDbService,
    private store: Store<AppState>,
    private loading: LoadingService,
    private userLessonsDb: UserLessonStatusDbService,
    private router:Router,
    private lessonsDB: LessonsDBService) {

  }

}
