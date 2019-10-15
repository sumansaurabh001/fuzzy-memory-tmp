import {createAction, props} from '@ngrx/store';
import {LatestLesson} from '../models/latest-lesson.model';


export const loadNextLatestLessonsPage = createAction(
  "[Latest Lessons Resolver] Load Latest Lessons Page"
);


export const latestLessonsPageLoaded = createAction(
  "[Latest Lessons Effects] Latest Lessons Page Loaded",
  props<{latestLessons: LatestLesson[]}>()
);

export const navigateToLesson = createAction(
  "[Latest Lessons List] Navigate to Lesson",
  props<{lesson:LatestLesson}>()
);

export const changeLatestLessonsSortOrder = createAction(
  "[Latest Lessons List] Change Latest Lessons Sort Order",
  props<{sortOrder: string}>()
);
