
import * as fromCourse from './course.reducer';
import {
  createFeatureSelector,
  createSelector
} from '@ngrx/store';



export const selectCoursesState = createFeatureSelector<fromCourse.State>('courses');

export const selectDescriptionsState = createFeatureSelector<fromCourse.State>('descriptions');



export const selectCourseIds = createSelector(selectCoursesState, fromCourse.selectIds);

export const selectCourseEntities = createSelector(selectCoursesState, fromCourse.selectEntities);

export const selectAllCourses = createSelector(selectCoursesState, fromCourse.selectAll);

export const selectTotalCourses = createSelector(selectCoursesState, fromCourse.selectTotal);


export const selectAllCoursesAndDescriptions = createSelector(
  selectAllCourses,
  selectDescriptionsState,
  (courses,descriptions) => [courses, descriptions]
);


export const selectEditedCourse = createSelector(
  selectCoursesState,
  state => state.entities[state.editedCourseId]
);


export const selectInitialCoursesLoaded = createSelector(
  selectCoursesState,
  state => state.initialCoursesLoaded
);



export const selectEditedCourseDescription = createSelector(
  selectDescriptionsState,
  selectEditedCourse,
  (descriptions, course) => descriptions[course.id]
);
