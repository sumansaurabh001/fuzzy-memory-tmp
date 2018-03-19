
import * as fromCourse from './course.reducer';
import {
  createFeatureSelector,
  createSelector
} from '@ngrx/store';



export const selectCoursesState = createFeatureSelector<fromCourse.State>('courses');

export const selectDescriptionsState = createFeatureSelector<fromCourse.State>('descriptions');

export const selectCourseSectionsState = createFeatureSelector<fromCourse.State>('sections');



export const selectCourseIds = createSelector(selectCoursesState, fromCourse.selectIds);

export const selectCourseEntities = createSelector(selectCoursesState, fromCourse.selectEntities);

export const selectAllCourses = createSelector(selectCoursesState, fromCourse.selectAll);

export const selectTotalCourses = createSelector(selectCoursesState, fromCourse.selectTotal);





export const selectEditedCourse = createSelector(
  selectCoursesState,
  selectAllCourses,
  (state, courses) => courses.find(course => course.url === state.editedCourseUrl)
);


export const selectInitialCoursesLoaded = createSelector(
  selectCoursesState,
  state => state.initialCoursesLoaded
);

export const selectEditedCourseDescription = createSelector(
  selectDescriptionsState,
  selectEditedCourse,
  (descriptions, course) =>  course ? descriptions[course.url] : ''
);


