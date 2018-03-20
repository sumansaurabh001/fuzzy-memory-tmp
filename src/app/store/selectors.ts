
import * as fromCourse from './course.reducer';
import {
  createFeatureSelector,
  createSelector
} from '@ngrx/store';
import * as fromSection from './course-section.reducer';
import * as fromLesson from './lesson.reducer';



export const selectCoursesState = createFeatureSelector<fromCourse.State>('courses');

export const selectDescriptionsState = createFeatureSelector<fromCourse.State>('descriptions');

export const selectSectionsState = createFeatureSelector<fromSection.State>('sections');

export const selectLessonsState = createFeatureSelector<fromLesson.State>('lessons');



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


export const selectEditedCourseSummary = createSelector(
  selectCoursesState,
  selectAllCourses,
  (state, courses) => courses.find(course => course.id === state.editedCourseId)
);


export const selectEditedCourseDescription = createSelector(
  selectDescriptionsState,
  selectEditedCourseSummary,
  (descriptions, editedCourse) =>  editedCourse ? descriptions[editedCourse.id] : ''
);



export const selectEditedCourseSections = createSelector(
  selectAllSections,
  selectEditedCourseSummary,
  (sections, course) =>  course ? sections.filter(section => section.courseId === course.id) : []
);


export const selectEditedCourseSectionIds = createSelector(
  selectEditedCourseSections,
  sections => sections.map(section => section.id)
);



export const selectEditedCourseLessons = createSelector(
  selectAllLessons,
  selectEditedCourseSectionIds,
  (lessons, sectionIds) => lessons.filter(lesson => sectionIds.includes(lesson.sectionId))
);


export const selectEditedCourseDetail = createSelector(
  selectEditedCourseSummary,
  selectEditedCourseSections,
  selectEditedCourseLessons,
  (summary, editedSections, editedLessons) => {

    const sectionsWithLessons = editedSections.map(section => {
          return {
            ...section,
            lessons: editedLessons.filter(lesson => lesson.sectionId === section.id)
          }
    });

    const courseWithSections = {
      ...summary,
      sections: sectionsWithLessons
    };

    return courseWithSections;
  }
);


export const isEditedSectionsLoaded = createSelector(
  selectSectionsState,
  selectEditedCourseSummary,
  (state, editedCourse) =>  editedCourse ? (editedCourse.id in state.loadedCourses): false
);


export const isEditedLessonsLoaded = createSelector(
  selectEditedCourseSummary,
  selectLessonsState,
  (editedCourse, lessonsState) =>  editedCourse? (editedCourse.id in lessonsState.loadedCourses) : false
);


export const isEditedCourseDescriptionLoaded = createSelector(
  selectDescriptionsState,
  selectEditedCourseSummary,
  (descriptions, editedCourse) =>  editedCourse ? (editedCourse.id in descriptions) : false
);



