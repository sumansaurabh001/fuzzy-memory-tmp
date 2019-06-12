import {Injectable} from '@angular/core';
import {Actions, createEffect, Effect, ofType} from '@ngrx/effects';
import {
 userCoursesLoaded, updateCourseSortOrderCompleted
} from '../store/course.actions';
import {concatMap, catchError, withLatestFrom, filter, map, tap} from 'rxjs/operators';
import {CoursesDBService} from '../services/courses-db.service';
import {LoadingService} from '../services/loading.service';
import {MessagesService} from '../services/messages.service';
import {throwError, combineLatest} from 'rxjs';
import {AppState} from './index';
import {select, Store} from '@ngrx/store';
import {DescriptionsDbService} from '../services/descriptions-db.service';
import {addDescription, loadDescription} from './description.actions';
import {
  isActiveCourseDescriptionLoaded,
  isActiveCourseSectionsLoaded,
  selectActiveCourse,
  selectActiveCourseDescription,
  selectActiveCourseSections,
  isActiveCourseLessonsLoaded,
  selectDescriptionsState,
  isActiveLessonVideoAccessLoaded,
  selectPendingLessonsReorder, selectPendingCoursesReorder, selectPendingSectionsReorder, selectActiveCourseAllLessons
} from './selectors';
import {LessonsDBService} from '../services/lessons-db.service';
import {
  courseLessonsLoaded,
  updateLesson,
  updateLessonOrder,
  updateLessonOrderCompleted,
  watchLesson
} from './lesson.actions';
import {AngularFireAuth} from '@angular/fire/auth';
import {SchoolUsersDbService} from '../services/school-users-db.service';
import {TenantService} from '../services/tenant.service';
import {VideoService} from '../services/video.service';
import {PaymentsService} from '../services/payments.service';
import {sortLessonsBySectionAndSeqNo} from '../common/sort-model';
import {CourseSection} from '../models/course-section.model';
import {Lesson} from '../models/lesson.model';
import {CourseActions, CourseSectionActions} from './action-types';
import {courseSectionsLoaded, updateSectionOrderCompleted} from './course-section.actions';


@Injectable()
export class CourseEffects {

  createNewCourse$ = createEffect(() => this.actions$
    .pipe(
      ofType(CourseActions.createNewCourse),
      concatMap(({course}) => this.coursesDB.createNewCourse(course))
    ),
    {dispatch:false});

  loadUserCourses$ = createEffect(() => combineLatest(
    this.afAuth.authState,
    this.tenant.tenantId$
  )
    .pipe(
      filter(([user, tenantId]) => !!(user && tenantId)),
      concatMap(([user, tenantId]) => this.usersDB.loadUserCourses(tenantId, user.uid)),
      map(purchasedCourses => userCoursesLoaded({purchasedCourses})),
      catchError(err => {
        this.messages.error('Could not load user courses.');
        return throwError(err);
      })
    ));

  loadCourseDescriptionIfNeeded$ = createEffect(() => this.actions$
    .pipe(
      ofType(CourseActions.loadCourseDetail),
      map(({courseId}) => loadDescription({descriptionId: courseId})),
      catchError(err => {
        this.messages.error('Could not load course description.');
        return throwError(err);
      })
    ));


  loadSectionsIfNeeded$ = createEffect(() => this.actions$
    .pipe(
      ofType(CourseActions.loadCourseDetail),
      withLatestFrom(this.store.pipe(select(isActiveCourseSectionsLoaded))),
      filter(([action, loaded]) => !loaded),
      concatMap(
        ([{courseId}]) => this.loading.showLoader(this.lessonsDB.loadCourseSections(courseId)),
        ([{courseId}], courseSections) => courseSectionsLoaded({courseSections, courseId})
      ),
      catchError(err => {
        this.messages.error('Could not load sections.');
        return throwError(err);
      })
    ));


  loadLessonsIfNeeded$ = createEffect(() => this.actions$
    .pipe(
      ofType(CourseActions.loadCourseDetail),
      withLatestFrom(this.store.pipe(select(isActiveCourseLessonsLoaded))),
      filter(([action, loaded]) => !loaded),
      concatMap(
        ([{courseId}]) => this.loading.showLoader(this.lessonsDB.loadCourseLessons(courseId)),
        ([{courseId}], lessons) => courseLessonsLoaded({lessons, courseId})
      ),
      catchError(err => {
        this.messages.error('Could not load lessons.');
        return throwError(err);
      })
    ));


  deleteCourse$ = createEffect(() => this.actions$
    .pipe(
      ofType(CourseActions.deleteCourse),
      concatMap(({id}) => this.loading.showLoader(this.coursesDB.deleteCourseDraft(id))),
      catchError(err => {
        this.messages.error('Could not delete the course draft.', err);
        return throwError(err);
      })
    ),
    {dispatch: false});


  saveCourse$ = createEffect(() => this.actions$
    .pipe(
      ofType(CourseActions.updateCourse),
      concatMap(({course}) => this.loading.showLoader(this.coursesDB.saveCourse(course.id, course.changes))),
      catchError(err => {
        this.messages.error('Could not save course.');
        return throwError(err);
      })
    ),
    {dispatch:false});


  saveCoursesReordering$ = createEffect(() => this.actions$
    .pipe(
      ofType(CourseActions.updateCourseSortOrder),
      withLatestFrom(this.store.pipe(select(selectPendingCoursesReorder))),
      concatMap(([action, changes]) => this.coursesDB.updateCourses(changes)),
      map(() => updateCourseSortOrderCompleted()),
      catchError(err => {
        this.messages.error('Could not save the new course order.');
        return throwError(err);
      })
    ));

  saveCourseSectionReordering$ = createEffect(() => this.actions$
    .pipe(
      ofType(CourseSectionActions.updateSectionOrder),
      withLatestFrom(this.store.pipe(select(selectPendingSectionsReorder))),
      concatMap(([{courseId}, changes]) => this.coursesDB.updateCourseSections(courseId, changes)),
      map(() => updateSectionOrderCompleted()),
      catchError(err => {
        this.messages.error('Could not save the new section order.');
        return throwError(err);
      })
    ));



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
