
import * as fromCourse from './course.reducer';
import {
  createFeatureSelector,
  createSelector
} from '@ngrx/store';
import * as fromSection from './course-section.reducer';
import * as fromLesson from './lesson.reducer';
import {Course} from '../models/course.model';



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



export const selectEditedCourseSections = createSelector(
  selectAllSections,
  selectEditedCourse,
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
  selectEditedCourse,
  selectEditedCourseSections,
  selectEditedCourseLessons,
  selectDescriptionsState,
  (courseSummary, editedSections, editedLessons, descriptions) => {

    const sectionsWithLessons = editedSections.map(section => {
          return {
            ...section,
            lessons: editedLessons
              .filter(lesson => lesson.sectionId === section.id)
              .map(lesson => {
                return {
                  ...lesson,
                  description: descriptions[lesson.id]
                }})
          }
    });

    const courseWithSections: Course = {
      ...courseSummary,
      sections: sectionsWithLessons,
      longDescription: descriptions[courseSummary.id]

    };

    return courseWithSections;
  }
);


export const isEditedSectionsLoaded = createSelector(
  selectSectionsState,
  selectEditedCourse,
  (state, editedCourse) =>  editedCourse ? (editedCourse.id in state.loadedCourses): false
);


export const isEditedLessonsLoaded = createSelector(
  selectEditedCourse,
  selectLessonsState,
  (editedCourse, lessonsState) =>  editedCourse? (editedCourse.id in lessonsState.loadedCourses) : false
);


export const isEditedCourseDescriptionLoaded = createSelector(
  selectDescriptionsState,
  selectEditedCourse,
  (descriptions, editedCourse) =>  editedCourse ? (editedCourse.id in descriptions) : false
);



export const isEditedCourseLoaded = createSelector(
  selectEditedCourse,
  selectSectionsState,
  selectLessonsState,
  (course, sectionsState, lessonsState) => sectionsState.loadedCourses[course.id] && lessonsState.loadedCourses[course.id]
);
