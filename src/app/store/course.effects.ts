import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {
  CourseActionTypes,
  CoursePurchased,
  UpdateCourseSortOrder,
  DeleteCourse,
  UserCoursesLoaded, UpdateCourseSortOrderCompleted
} from '../store/course.actions';
import {concatMap, catchError, withLatestFrom, filter, map, tap} from 'rxjs/operators';
import {CoursesDBService} from '../services/courses-db.service';
import {LoadingService} from '../services/loading.service';
import {MessagesService} from '../services/messages.service';
import {throwError as _throw, combineLatest} from 'rxjs';
import {CreateNewCourse, LoadCourseDetail, UpdateCourse} from './course.actions';
import {AppState} from './index';
import {select, Store} from '@ngrx/store';
import {DescriptionsDbService} from '../services/descriptions-db.service';
import {AddDescription, LoadDescription} from './description.actions';
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
import {CourseSectionsLoaded, CourseSectionActionTypes, UpdateSectionOrder, UpdateSectionOrderCompleted} from './course-section.actions';
import {
  CourseLessonsLoaded,
  LessonActionTypes,
  LessonsSequentiallyNumbered,
  UpdateLesson,
  UpdateLessonOrder,
  UpdateLessonOrderCompleted,
  WatchLesson
} from './lesson.actions';
import {AngularFireAuth} from '@angular/fire/auth';
import {SchoolUsersDbService} from '../services/school-users-db.service';
import {TenantService} from '../services/tenant.service';
import {VideoService} from '../services/video.service';
import {SaveVideoAccess} from './video-access.actions';
import {PaymentsService} from '../services/payments.service';
import {sortLessonsBySectionAndSeqNo} from '../common/sort-model';
import {CourseSection} from '../models/course-section.model';
import {Lesson} from '../models/lesson.model';


@Injectable()
export class CourseEffects {

  @Effect({dispatch: false})
  createNewCourse$ = this.actions$
    .pipe(
      ofType<CreateNewCourse>(CourseActionTypes.CreateNewCourse),
      concatMap(action => this.coursesDB.createNewCourse(action.payload.course))
    );

  @Effect()
  loadUserCourses$ = combineLatest(
    this.afAuth.authState,
    this.tenant.tenantId$
  )
    .pipe(
      filter(([user, tenantId]) => !!(user && tenantId)),
      concatMap(([user, tenantId]) => this.usersDB.loadUserCourses(tenantId, user.uid)),
      map(purchasedCourses => new UserCoursesLoaded({purchasedCourses})),
      catchError(err => {
        this.messages.error('Could not load user courses.');
        return _throw(err);
      })
    );

  @Effect()
  loadCourseDescriptionIfNeeded$ = this.actions$
    .pipe(
      ofType<LoadCourseDetail>(CourseActionTypes.LoadCourseDetail),
      map(action => new LoadDescription(action.payload.courseId)),
      catchError(err => {
        this.messages.error('Could not load course description.');
        return _throw(err);
      })
    );

  @Effect()
  loadSectionsIfNeeded$ = this.actions$
    .pipe(
      ofType<LoadCourseDetail>(CourseActionTypes.LoadCourseDetail),
      withLatestFrom(this.store.pipe(select(isActiveCourseSectionsLoaded))),
      filter(([action, loaded]) => !loaded),
      concatMap(
        ([action]) => this.loading.showLoader(this.lessonsDB.loadCourseSections(action.payload.courseId)),
        ([action], courseSections) => new CourseSectionsLoaded({courseSections, courseId: action.payload.courseId})
      ),
      catchError(err => {
        this.messages.error('Could not load sections.');
        return _throw(err);
      })
    );

  @Effect()
  loadLessonsIfNeeded$ = this.actions$
    .pipe(
      ofType<LoadCourseDetail>(CourseActionTypes.LoadCourseDetail),
      withLatestFrom(this.store.pipe(select(isActiveCourseLessonsLoaded))),
      filter(([action, loaded]) => !loaded),
      concatMap(
        ([action]) => this.loading.showLoader(this.lessonsDB.loadCourseLessons(action.payload.courseId)),
        ([action], lessons) => new CourseLessonsLoaded({lessons, courseId: action.payload.courseId})
      ),
      catchError(err => {
        this.messages.error('Could not load lessons.');
        return _throw(err);
      })
    );

  @Effect()
  numberLessonsSequentially$ = this.actions$
    .pipe(
      ofType(CourseSectionActionTypes.CourseSectionsLoaded, LessonActionTypes.CourseLessonsLoaded),
      withLatestFrom(
        this.store.pipe(select(isActiveCourseSectionsLoaded)),
        this.store.pipe(select(isActiveCourseLessonsLoaded)),
        this.store.pipe(select(selectActiveCourseAllLessons)),
        this.store.pipe(select(selectActiveCourseSections))
      ),
      filter(([action, sectionsLoaded, lessonsLoaded]) => sectionsLoaded && lessonsLoaded),
      map( ([action, sectionsLoaded, lessonsLoaded, lessons, sections]) => sortLessonsBySectionAndSeqNo(lessons, sections)),
      map(sortedLessons => new LessonsSequentiallyNumbered({sortedLessons}))
    );

  @Effect({dispatch: false})
  deleteCourse$ = this.actions$
    .pipe(
      ofType<DeleteCourse>(CourseActionTypes.DeleteCourse),
      concatMap(action => this.loading.showLoader(this.coursesDB.deleteCourseDraft(action.payload.id))),
      catchError(err => {
        this.messages.error('Could not delete the course draft.', err);
        return _throw(err);
      })
    );

  @Effect({dispatch: false})
  saveCourse$ = this.actions$
    .pipe(
      ofType<UpdateCourse>(CourseActionTypes.UpdateCourse),
      concatMap(action => this.loading.showLoader(this.coursesDB.saveCourse(action.payload.course.id, action.payload.course.changes))),
      catchError(err => {
        this.messages.error('Could not save course.');
        return _throw(err);
      })
    );

  @Effect()
  saveCoursesReordering$ = this.actions$
    .pipe(
      ofType<UpdateCourseSortOrder>(CourseActionTypes.UpdateCourseSortOrder),
      withLatestFrom(this.store.pipe(select(selectPendingCoursesReorder))),
      concatMap(([action, changes]) => this.coursesDB.updateCourses(changes)),
      map(() => new UpdateCourseSortOrderCompleted()),
      catchError(err => {
        this.messages.error('Could not save the new course order.');
        return _throw(err);
      })
    );

  @Effect()
  saveCourseSectionReordering$ = this.actions$
    .pipe(
      ofType<UpdateSectionOrder>(CourseSectionActionTypes.UpdatedSectionOrder),
      withLatestFrom(this.store.pipe(select(selectPendingSectionsReorder))),
      concatMap(([action, changes]) => this.coursesDB.updateCourseSections(action.payload.courseId, changes)),
      map(() => new UpdateSectionOrderCompleted()),
      catchError(err => {
        this.messages.error('Could not save the new section order.');
        return _throw(err);
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
