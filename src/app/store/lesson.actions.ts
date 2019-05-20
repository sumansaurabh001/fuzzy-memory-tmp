import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Lesson } from '../models/lesson.model';
import {UpdateStr} from '@ngrx/entity/src/models';
import {CourseSection} from '../models/course-section.model';

export enum LessonActionTypes {
  WatchLesson = '[Lesson] Watch Lesson',
  AddLesson = '[Lesson] Add Lesson',
  AddLessons = '[Lesson] Add Lessons',
  UpdateLesson = '[Lesson] Update Lesson',
  DeleteLesson = '[Lesson] Delete Lesson',
  LoadLessonVideo = '[Watch Course Screen] Load Lesson Video',
  UpdateLessonOrder = '[Edit Lessons Screen] Update Lesson Order',
  UpdateLessonOrderCompleted = '[Lesson Effects] Update Lesson Order Completed',
  UploadStarted = "[Edit Course Screen] Upload Started",
  UploadFinished = "[Edit Course Screen] Upload Finished"
}

export class WatchLesson implements Action {
  readonly type = LessonActionTypes.WatchLesson;

  constructor(public payload: {lessonId: string}) {}

}

export class AddLesson implements Action {
  readonly type = LessonActionTypes.AddLesson;

  constructor(public payload: { lesson: Lesson }) {}
}

export class AddLessons implements Action {
  readonly type = LessonActionTypes.AddLessons;

  constructor(public payload: { lessons: Lesson[],  courseId:string  }) {}
}

export class UpdateLesson implements Action {
  readonly type = LessonActionTypes.UpdateLesson;

  constructor(public payload: { lesson: UpdateStr<Lesson>, courseId:string }) {}
}

export class DeleteLesson implements Action {
  readonly type = LessonActionTypes.DeleteLesson;

  constructor(public payload: { id: string }) {}
}

export class LoadLessonVideo implements Action {
  readonly type = LessonActionTypes.LoadLessonVideo;

  constructor(public payload: {update: Update<Lesson>}) {}

}

export class UpdateLessonOrder implements Action {

  readonly type = LessonActionTypes.UpdateLessonOrder;

  constructor(public payload:{courseId:string, previousIndex:number, currentIndex:number, sections:CourseSection[]} ) {}

}

export class UpdateLessonOrderCompleted implements Action {

  readonly type = LessonActionTypes.UpdateLessonOrderCompleted;

}

export class UploadStarted implements Action {

  readonly type = LessonActionTypes.UploadStarted;

  constructor(public payload: {fileName:string}) {}
}

export class UploadFinished implements Action {

  readonly type = LessonActionTypes.UploadFinished;

  constructor(public payload: {fileName:string}) {}
}

export type LessonActions =
  WatchLesson
 | AddLesson
 | AddLessons
 | UpdateLesson
 | DeleteLesson
 | LoadLessonVideo
 | UpdateLessonOrder
 | UpdateLessonOrderCompleted
 | UploadStarted
 | UploadFinished;
