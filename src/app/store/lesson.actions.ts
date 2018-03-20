import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Lesson } from '../models/lesson.model';

export enum LessonActionTypes {
  LoadLessons = '[Lesson] Load Lessons',
  AddLesson = '[Lesson] Add Lesson',
  UpsertLesson = '[Lesson] Upsert Lesson',
  AddLessons = '[Lesson] Add Lessons',
  UpsertLessons = '[Lesson] Upsert Lessons',
  UpdateLesson = '[Lesson] Update Lesson',
  UpdateLessons = '[Lesson] Update Lessons',
  DeleteLesson = '[Lesson] Delete Lesson',
  DeleteLessons = '[Lesson] Delete Lessons',
  ClearLessons = '[Lesson] Clear Lessons'
}

export class LoadLessons implements Action {
  readonly type = LessonActionTypes.LoadLessons;

  constructor(public payload: { lessons: Lesson[] }) {}
}

export class AddLesson implements Action {
  readonly type = LessonActionTypes.AddLesson;

  constructor(public payload: { lesson: Lesson }) {}
}

export class UpsertLesson implements Action {
  readonly type = LessonActionTypes.UpsertLesson;

  constructor(public payload: { lesson: Update<Lesson> }) {}
}

export class AddLessons implements Action {
  readonly type = LessonActionTypes.AddLessons;

  constructor(public payload: { lessons: Lesson[],  courseId:string  }) {}
}

export class UpsertLessons implements Action {
  readonly type = LessonActionTypes.UpsertLessons;

  constructor(public payload: { lessons: Update<Lesson>[] }) {}
}

export class UpdateLesson implements Action {
  readonly type = LessonActionTypes.UpdateLesson;

  constructor(public payload: { lesson: Update<Lesson> }) {}
}

export class UpdateLessons implements Action {
  readonly type = LessonActionTypes.UpdateLessons;

  constructor(public payload: { lessons: Update<Lesson>[] }) {}
}

export class DeleteLesson implements Action {
  readonly type = LessonActionTypes.DeleteLesson;

  constructor(public payload: { id: string }) {}
}

export class DeleteLessons implements Action {
  readonly type = LessonActionTypes.DeleteLessons;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearLessons implements Action {
  readonly type = LessonActionTypes.ClearLessons;
}

export type LessonActions =
 LoadLessons
 | AddLesson
 | UpsertLesson
 | AddLessons
 | UpsertLessons
 | UpdateLesson
 | UpdateLessons
 | DeleteLesson
 | DeleteLessons
 | ClearLessons;
