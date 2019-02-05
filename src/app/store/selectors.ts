
import * as fromCourse from './course.reducer';
import {
  createFeatureSelector,
  createSelector
} from '@ngrx/store';
import * as fromSection from './course-section.reducer';
import * as fromLesson from './lesson.reducer';
import {AuthState} from './auth.reducer';
import {Tenant} from '../models/tenant.model';
import {PlatformState} from './platform.reducer';
import {CouponsState} from './coupons.reducer';
import * as fromCoupon from './coupons.reducer';
import {VideoAccessState} from './video-access.reducer';
import {PricingPlansState} from './pricing-plans.reducer';


export const selectCoursesState = createFeatureSelector<fromCourse.State>('courses');

export const selectDescriptionsState = createFeatureSelector<fromCourse.State>('descriptions');

export const selectSectionsState = createFeatureSelector<fromSection.State>('sections');

export const selectLessonsState = createFeatureSelector<fromLesson.State>('lessons');

export const authState = createFeatureSelector<AuthState>('auth');

export const platformState = createFeatureSelector<PlatformState>('platform');

export const couponsState = createFeatureSelector<CouponsState>('coupons');

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
  (lessons, sectionIds) => lessons.filter(lesson => sectionIds.includes(lesson.sectionId))
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
  authState,
  auth => auth.isLoggedIn
);


export const isLoggedOut = createSelector(
  isLoggedIn,
  loggedIn => !loggedIn
);

export const userPictureUrl = createSelector(
  authState,
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


export const selectAllCoupons = createSelector(couponsState, fromCoupon.selectAll);

export const selectActiveCourseCoupons = createSelector(
  selectAllCoupons,
  selectActiveCourse,
  (coupons, course) => coupons.filter(coupon => coupon.courseId == course.id && coupon.active)
);

export const selectAllCourseCoupons = createSelector(
  selectAllCoupons,
  selectActiveCourse,
  (coupons, course) => coupons.filter(coupon => coupon.courseId == course.id)
);


export const isConnectedToStripe = createSelector(
  platformState,
  settings => !!settings.isConnectedToStripe

);


export const selectUserPermissions = createSelector(
    authState,
    authState => authState.permissions
);

export const selectUserCourses = createSelector(
  selectCoursesState,
  coursesState => coursesState.coursesPurchased
);


export const isAdmin = createSelector(
  authState,
  authState => authState.permissions.isAdmin
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

export const selectPricingPlans = createSelector(
  pricingPlansState
);
