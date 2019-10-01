import { createAction, props} from '@ngrx/store';
import {Update} from '@ngrx/entity';
import {Course} from '../models/course.model';



export const courseLoaded = createAction(
  '[Course] Course Loaded',
  props<{ course: Course }>()
);

export const loadCourseDetail = createAction(
  '[Course] Load Course Detail',
  props<{ courseId: string }>()
);

export const loadCourses = createAction(
  '[Course] Load Courses',
  props<{ courses: Course[] }>()
);

export const createNewCourse = createAction(
  '[Add Course Dialog] Create New Course',
  props<{ course: Course }>()
);

export const updateCourse = createAction(
  '[Course] Update Course',
  props<{ course: Update<Course> }>()
);

export const deleteCourse = createAction(
  '[Course] Delete Course',
  props<{ id: string }>()
);

export const coursePurchased = createAction(
  '[Course Page] Course Purchased',
  props<{courseId:string}>()
);


export const userCoursesLoaded = createAction(
  '[App Startup] User Courses Loaded',
  props<{purchasedCourses:string[]}>()
);


export const updateCourseSortOrder = createAction(
  '[Courses Screen] Course Sort Order Updated',
  props<{newSortOrder:Course[]}>()
);


export const updateCourseSortOrderCompleted = createAction(
  '[Courses Screen] Update Course Sort Order Completed'
);

export const coursePublished = createAction(
  '[Publish Course Dialog] Course Published',
  props<{courseId:string, url:string}>()
);

export const courseUnpublished = createAction(
  "[Unpublish Course Dialog] Unpublish Course",
  props<{courseId:string}>()
);


