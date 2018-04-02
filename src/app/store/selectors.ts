
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



export const selectActiveCourseLessons = createSelector(
  selectAllLessons,
  selectActiveCourseSectionIds,
  (lessons, sectionIds) => lessons.filter(lesson => sectionIds.includes(lesson.sectionId))
);


export const selectActiveCourseDetail = createSelector(
  selectActiveCourse,
  selectActiveCourseSections,
  selectActiveCourseLessons,
  selectDescriptionsState,
  (courseSummary, sections, lessons, descriptions) => {

    const sectionsWithLessons = sections.map(section => {
          return {
            ...section,
            lessons: lessons
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
      longDescription: courseSummary? descriptions[courseSummary.id] : undefined

    };

    return courseWithSections;
  }
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
