import {LatestLesson} from '../models/latest-lesson.model';
import {createReducer, on} from '@ngrx/store';
import {CourseSectionActions, LatestLessonActions, LessonActions} from './action-types';


export interface LatestLessonsState {
  latestLessons: LatestLesson[];
  lastPageLoaded:number;
  allPagesLoaded: boolean;
  sortOrder: "desc" | "asc";
}

export const initialLatestLessonsState: LatestLessonsState = {
  latestLessons: [],
  lastPageLoaded: null,
  allPagesLoaded: false,
  sortOrder: "desc"
};

export const latestLessonsReducer = createReducer(
  initialLatestLessonsState,

  on(LatestLessonActions.latestLessonsPageLoaded, (state, action) => {
    return {
      ...state,
      lastPageLoaded: state.lastPageLoaded + 1,
      latestLessons: state.latestLessons.concat(action.latestLessons),
      allPagesLoaded: action.latestLessons.length == 0
    }
  }),

  on(LatestLessonActions.changeLatestLessonsSortOrder, (state, action) => {
    return {
      ...initialLatestLessonsState,
      sortOrder: action.sortOrder
    }
  }),

  on(
    LessonActions.updateLesson,
    LessonActions.publishLesson,
    LessonActions.unpublishLesson,
    CourseSectionActions.updateSectionOrder,
    CourseSectionActions.updateCourseSection,
    CourseSectionActions.deleteCourseSection,
    CourseSectionActions.addCourseSection, (state, action) => {
    return {
     ...initialLatestLessonsState,
    }
  })


);
