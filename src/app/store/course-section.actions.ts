import {Action, createAction, props} from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { CourseSection } from '../models/course-section.model';




export const addCourseSection = createAction(
  '[CourseSection] Add Course Section',
  props<{ courseSection: CourseSection }>()
);

export const courseSectionsLoaded = createAction(
  '[Course Effects] Course Sections Loaded',
  props<{ courseSections: CourseSection[], courseId:string }>()
);

export const updateCourseSection = createAction(
  '[CourseSection] Update Course Section',
  props<{ courseSection: Update<CourseSection> }>()
);

export const deleteCourseSection = createAction(
  '[CourseSection] Delete Course Section',
  props<{ id: string }>()
);

export const updateSectionOrder = createAction(
  '[Edit Lessons Screen] Updated Section Order',
  props<{courseId:string, newSortOrder: CourseSection[]}>()
);


export const updateSectionOrderCompleted = createAction(
  '[Edit Lessons Screen] Updated Section Order Completed'
);



