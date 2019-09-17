
import * as fromCourse from './course.reducer';
import {
  createFeatureSelector,
  createSelector
} from '@ngrx/store';
import * as fromSection from './course-section.reducer';
import * as fromLesson from './lesson.reducer';
import {UserState} from './user.reducer';
import {PlatformState} from './platform.reducer';
import {VideoAccessState} from './video-access.reducer';
import {PricingPlansState} from './pricing-plans.reducer';
import {compareLessons, sortLessonsBySectionAndSeqNo} from '../common/sort-model';


export const selectCoursesState = createFeatureSelector<fromCourse.State>('courses');

export const selectDescriptionsState = createFeatureSelector<fromCourse.State>('descriptions');

export const selectSectionsState = createFeatureSelector<fromSection.State>('sections');

export const selectLessonsState = createFeatureSelector<fromLesson.State>('lessons');

export const userState = createFeatureSelector<UserState>('user');

export const platformState = createFeatureSelector<PlatformState>('platform');

export const videoAccessState = createFeatureSelector<VideoAccessState>('videoAccess');

export const pricingPlansState = createFeatureSelector<PricingPlansState>('pricingPlans');



export const selectCourseIds = createSelector(selectCoursesState, fromCourse.selectIds);

export const selectCourseEntities = createSelector(selectCoursesState, fromCourse.selectEntities);

export const selectAllCourses = createSelector(selectCoursesState, fromCourse.selectAll);

export const selectTotalCourses = createSelector(selectCoursesState, fromCourse.selectTotal);



export const selectAllSections = createSelector(selectSectionsState, fromSection.selectAll);

export const selectAllLessons = createSelector(selectLessonsState, fromLesson.selectAll);




export const selectInitialCoursesLoaded = createSelector(
  selectCoursesState,
  state => state.initialCoursesLoaded
);


export const selectActiveCourse = createSelector(
  selectCoursesState,
  selectAllCourses,
  (state, courses) => courses.find(course => course.id === state.activeCourseId)
);


export const selectActiveCourseDescription = createSelector(
  selectDescriptionsState,
  selectActiveCourse,
  (descriptions, course) =>  course ? descriptions[course.id] : ''
);



export const selectActiveCourseSections = createSelector(
  selectAllSections,
  selectActiveCourse,
  (sections, course) =>  course ? sections.filter(section => section.courseId === course.id) : []
);


export const selectActiveCourseSectionIds = createSelector(
  selectActiveCourseSections,
  sections => sections.map(section => section.id)
);



export const selectActiveCourseAllLessons = createSelector(
  selectAllLessons,
  selectActiveCourseSectionIds,
  (lessons, sectionIds) => lessons.filter(lesson => sectionIds.includes(lesson.sectionId)).sort(compareLessons)
);



export const selectActiveLesson = createSelector(
  selectLessonsState,
  selectActiveCourseAllLessons,
  (lessonsState, activeCourseLessons) => activeCourseLessons.find(lesson => lesson.id === lessonsState.activeLessonId)
);



export const selectActiveSection = createSelector(
  selectSectionsState,
  selectActiveLesson,
  (sections, activeLesson) => sections[activeLesson.sectionId]
);





export const isActiveCourseSectionsLoaded = createSelector(
  selectSectionsState,
  selectActiveCourse,
  (state, course) =>  course ? (course.id in state.loadedCourses): false
);


export const isActiveCourseLessonsLoaded = createSelector(
  selectActiveCourse,
  selectLessonsState,
  (course, lessonsState) =>  course? (course.id in lessonsState.loadedCourses) : false
);


export const isActiveCourseDescriptionLoaded = createSelector(
  selectDescriptionsState,
  selectActiveCourse,
  (descriptions, course) =>  course ? (course.id in descriptions) : false
);



export const isActiveCourseLoaded = createSelector(
  selectActiveCourse,
  selectSectionsState,
  selectLessonsState,
  (course, sectionsState, lessonsState) => course ? sectionsState.loadedCourses[course.id] && lessonsState.loadedCourses[course.id]: false
);



export const isLoggedIn = createSelector(
  userState,
  auth => auth.isLoggedIn
);


export const isLoggedOut = createSelector(
  isLoggedIn,
  loggedIn => !loggedIn
);

export const userPictureUrl = createSelector(
  userState,
  auth => auth.user ? auth.user.pictureUrl : undefined
);

export const isBrandThemeLoaded = createSelector(
  platformState,
  platformState => !!platformState.brandTheme
);

export const getBrandTheme = createSelector(
  platformState,
  platformState => platformState.brandTheme
);


export const isConnectedToStripe = createSelector(
  platformState,
  settings => !!settings.isConnectedToStripe

);


export const selectUserPermissions = createSelector(
    userState,
    authState => authState.permissions
);

export const selectUser = createSelector(
  userState,
  authState => authState.user
);

export const isUserProfileLoaded = createSelector(
  userState,
  authState => authState.userProfileLoaded
);

export const selectUserCoursesIds = createSelector(
  selectCoursesState,
  coursesState => coursesState.coursesPurchased
);


export const selectUserCourses = createSelector(
  selectCoursesState,
  coursesState => coursesState.coursesPurchased.map(courseId => coursesState.entities[courseId])
);


export const isAdmin = createSelector(
  userState,
  authState => authState.permissions ? authState.permissions.isAdmin : false
);

export const isUserSubscribed = createSelector(
  selectUser,
  user => user && !!user.pricingPlan
);

export const selectActiveLessonVideoAccess = createSelector(
  selectActiveLesson,
  videoAccessState,
  (lesson, accessState) => lesson ? accessState.entities[lesson.id] : undefined
);

export const isActiveLessonVideoAccessLoaded = createSelector(
  selectActiveLesson,
  videoAccessState,
  (lesson, accessState) => lesson && !!accessState.entities[lesson.id]

);

export const arePricingPlansReady = createSelector(
  pricingPlansState,
  state => !!state.monthlyPlan
);


export const selectPendingLessonsReorder = createSelector(
  selectLessonsState,
  lessonsState => lessonsState.pendingLessonReordering
);

export const selectPendingCoursesReorder = createSelector(
  selectCoursesState,
  coursesState => coursesState.pendingCoursesReordering
);

export const selectPendingSectionsReorder = createSelector(
  selectSectionsState,
  sectionsState => sectionsState.pendingSectionsReordering
);


export const selectTenantInfo = createSelector(
  platformState,
  platformState => platformState.tenantInfo
);



export const isLessonUploadOngoing = createSelector(
  selectLessonsState,
  lessonsState => lessonsState.uploadsOngoing && lessonsState.uploadsOngoing.length > 0
);
