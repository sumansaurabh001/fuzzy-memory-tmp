import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {CourseActionTypes, DeleteCourse} from '../store/course.actions';
import {concatMap, catchError, withLatestFrom, filter, map, tap} from 'rxjs/operators';
import {CoursesDBService} from '../services/courses-db.service';
import {LoadingService} from '../services/loading.service';
import {MessagesService} from '../services/messages.service';
import {_throw} from 'rxjs/observable/throw';
import {AddCourse, LoadCourseDetail, UpdateCourse} from './course.actions';
import {AppState} from './index';
import {select, Store} from '@ngrx/store';
import {DescriptionsDbService} from '../services/descriptions-db.service';
import {AddDescription, LoadDescription} from './description.actions';
import {
  isActiveCourseDescriptionLoaded, isActiveCourseSectionsLoaded, selectActiveCourse, selectActiveCourseDescription,
  selectActiveCourseSections, isActiveCourseLessonsLoaded, selectDescriptionsState
} from './selectors';
import {LessonsDBService} from '../services/lessons-db.service';
import {AddCourseSections} from './course-section.actions';
import {AddLessons, LessonActionTypes, UpdateLesson} from './lesson.actions';




@Injectable()
export class CourseEffects {

  @Effect()
  loadCourseDescriptionIfNeeded$ = this.actions$
    .pipe(
      ofType<LoadCourseDetail>(CourseActionTypes.LoadCourseDetail),
      map(action => new LoadDescription(action.payload.courseId))
    );

  @Effect()
  loadSectionsIfNeeded$ = this.actions$
    .pipe(
      ofType<LoadCourseDetail>(CourseActionTypes.LoadCourseDetail),
      withLatestFrom(this.store.pipe(select(isActiveCourseSectionsLoaded))),
      filter(([action, loaded]) => !loaded),
      concatMap(
        ([action]) => this.loading.showLoader(this.lessonsDB.loadCourseSections(action.payload.courseId)),
        ([action], courseSections) => new AddCourseSections({courseSections, courseId: action.payload.courseId})
      ),
    );

  @Effect()
  loadLessonsIfNeeded$ = this.actions$
    .pipe(
      ofType<LoadCourseDetail>(CourseActionTypes.LoadCourseDetail),
      withLatestFrom(this.store.pipe(select(isActiveCourseLessonsLoaded))),
      filter(([action, loaded]) => !loaded),
      concatMap(
        ([action]) => this.loading.showLoader(this.lessonsDB.loadCourseLessons(action.payload.courseId)),
        ([action], lessons) => new AddLessons({lessons, courseId: action.payload.courseId})
      ),
    );


  @Effect({dispatch: false})
  deleteCourse$ = this.actions$
    .pipe(
      ofType<DeleteCourse>(CourseActionTypes.DeleteCourse),
      concatMap(action => this.loading.showLoader(this.coursesDB.deleteCourseDraft(action.payload.id))),
      catchError(err => {
        this.messages.error('Could not delete the course draft', err);
        return _throw(err);
      })
    );


  @Effect({dispatch: false})
  saveCourse$ = this.actions$
    .pipe(
      ofType<UpdateCourse>(CourseActionTypes.UpdateCourse),
      concatMap(action => this.loading.showLoader(this.coursesDB.saveCourse(action.payload.course.id, action.payload.course.changes))),
    );

  @Effect({dispatch: false})
  saveLesson$ = this.actions$
    .pipe(
      ofType<UpdateLesson>(LessonActionTypes.UpdateLesson),
      concatMap(action => this.lessonsDB.saveLesson(action.payload.courseId, action.payload.lesson)),
    );


  constructor(private actions$: Actions,
              private coursesDB: CoursesDBService,
              private lessonsDB: LessonsDBService,
              private store: Store<AppState>,
              private loading: LoadingService,
              private messages: MessagesService) {

  }


}
