
import * as fromCourse from './course.reducer';
import {
  createFeatureSelector,
  createSelector
} from '@ngrx/store';
import * as fromSection from './course-section.reducer';




export const selectCoursesState = createFeatureSelector<fromCourse.State>('courses');

export const selectDescriptionsState = createFeatureSelector<fromCourse.State>('descriptions');

export const selectSectionsState = createFeatureSelector<fromSection.State>('sections');



export const selectCourseIds = createSelector(selectCoursesState, fromCourse.selectIds);

export const selectCourseEntities = createSelector(selectCoursesState, fromCourse.selectEntities);

export const selectAllCourses = createSelector(selectCoursesState, fromCourse.selectAll);

export const selectTotalCourses = createSelector(selectCoursesState, fromCourse.selectTotal);




export const selectAllSections = createSelector(selectSectionsState, fromSection.selectAll);



export const selectInitialCoursesLoaded = createSelector(
  selectCoursesState,
  state => state.initialCoursesLoaded
);


export const selectEditedCourse = createSelector(
  selectCoursesState,
  selectAllCourses,
  (state, courses) => courses.find(course => course.id === state.editedCourseId)
);


export const selectEditedCourseDescription = createSelector(
  selectDescriptionsState,
  selectEditedCourse,
  (descriptions, editedCourse) =>  editedCourse ? descriptions[editedCourse.id] : ''
);


export const isEditedCourseDescriptionLoaded = createSelector(
  selectDescriptionsState,
  selectEditedCourse,
  (descriptions, editedCourse) =>  editedCourse ? (editedCourse.id in descriptions) : false
);




export const selectEditedCourseSections = createSelector(
  selectAllSections,
  selectEditedCourse,
  (sections, course) =>  course ? sections.filter(section => section.courseId === course.id) : []
);



export const isEditedSectionsLoaded = createSelector(
  selectSectionsState,
  selectEditedCourse,
  (state, editedCourse) =>  editedCourse ? (editedCourse.id in state.loadedCourses): false
);
