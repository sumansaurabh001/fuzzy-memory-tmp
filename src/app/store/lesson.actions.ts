import {Action, createAction, props} from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Lesson } from '../models/lesson.model';
import {UpdateStr} from '@ngrx/entity/src/models';
import {CourseSection} from '../models/course-section.model';



export const watchLesson = createAction(
  '[Lesson] Watch Lesson',
  props<{lessonId: string}>()
);

export const addLesson = createAction(
  '[Lesson] Add Lesson',
  props<{ lesson: Lesson }>()
);

export const courseLessonsLoaded = createAction(
  '[Course Effects] Course Lessons Loaded',
  props<{ lessons: Lesson[],  courseId:string  }>()
);

export const updateLesson = createAction(
  '[Lesson] Update Lesson',
  props<{ lesson: UpdateStr<Lesson>, courseId:string }>()
);

export const deleteLesson = createAction(
  '[Lesson] Delete Lesson',
  props<{ id: string }>()
);

export const loadLessonVideo = createAction(
  '[Watch Course Screen] Load Lesson Video',
  props<{update: Update<Lesson>}>()
);

export const updateLessonOrder = createAction(
  '[Edit Lessons Screen] Update Lesson Order',
  props<{courseId:string, previousIndex:number, currentIndex:number, sections:CourseSection[]}>()
);

export const updateLessonOrderCompleted = createAction(
  '[Lesson Effects] Update Lesson Order Completed'
);

export const uploadStarted = createAction(
  "[Edit Course Screen] Upload Started",
  props<{fileName:string}>()
);

export const uploadFinished = createAction(
  "[Edit Course Screen] Upload Finished",
  props<{fileName:string}>()
);


