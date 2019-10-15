import {createEntityAdapter, EntityAdapter, EntityState, Update} from '@ngrx/entity';
import {Lesson} from '../models/lesson.model';
import {compareLessons, sortLessonsBySectionAndSeqNo} from '../common/sort-model';
import {moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {LessonActions} from './action-types';
import {createReducer, on} from '@ngrx/store';


export interface State extends EntityState<Lesson> {
  loadedCourses: { [key: string]: boolean },
  activeLessonId: string,
  pendingLessonReordering: Update<Lesson>[],
  uploadsOngoing:string[];
}

export const adapter: EntityAdapter<Lesson> = createEntityAdapter<Lesson>({
  sortComparer: compareLessons
});

export const initialState: State = adapter.getInitialState({
  loadedCourses: {},
  activeLessonId: undefined,
  pendingLessonReordering: [],
  uploadsOngoing:[]
});


export const lessonReducer = createReducer(

  initialState,

  on(LessonActions.watchLesson, (state,action) => {
    return {
      ...state,
      activeLessonId: action.lessonId
    };
  }),

  on(LessonActions.addLesson, (state,action) => adapter.addOne(action.lesson, state)),

  on(LessonActions.courseLessonsLoaded, (state,action) => {
    const lessons = adapter.addMany(action.lessons, state);

    const newState = {
      ...lessons,
      loadedCourses: {...state.loadedCourses}
    };

    newState.loadedCourses[action.courseId] = true;

    return newState;
  }),

  on(LessonActions.updateLesson, (state,action) => adapter.updateOne(action.lesson, state)),

  on(LessonActions.deleteLesson, (state,action) => adapter.removeOne(action.id, state)),

  on(LessonActions.loadLessonVideo, (state,action) => adapter.updateOne(action.update, state)),

  on(LessonActions.updateLessonOrder, (state,action) => {

    const newSectionLessons = [...action.newSectionLessons],
      previousSectionLessons = [...action.previousSectionLessons];

    const sectionChanged = (action.previousSectionId !== action.newSectionId);

    if (!sectionChanged) {
      moveItemInArray( newSectionLessons, action.previousIndex, action.currentIndex);
    } else {
      transferArrayItem(previousSectionLessons, newSectionLessons, action.previousIndex, action.currentIndex);
    }

    const newSectionChanges = calculateSectionChanges(newSectionLessons, action.newSectionId),
          previousSectionChanges = calculateSectionChanges(previousSectionLessons, action.previousSectionId);

    const reorderChanges = newSectionChanges.concat(previousSectionChanges);

    return adapter.updateMany(reorderChanges, {...state, pendingLessonReordering: reorderChanges});
  }),

  on(LessonActions.updateLessonOrderCompleted, (state,action) => {
    return {
      ...state,
      pendingLessonReordering: []
    };
  }),

  on(LessonActions.uploadStarted, (state,action) => {
    return {
      ...state,
      uploadsOngoing: [...state.uploadsOngoing, action.fileName]
    };
  }),

  on(LessonActions.uploadFinished, (state,action) => {
    const newUploadsList = [...state.uploadsOngoing];

    newUploadsList.splice(newUploadsList.findIndex(fileName => fileName == action.fileName), 1);

    return {
      ...state,
      uploadsOngoing: newUploadsList
    };
  }),


  on(LessonActions.publishLesson, (state, action) => adapter.updateOne({
    id: action.lessonId,
    changes: {
      status: "published"
    }
  },state )),

  on(LessonActions.unpublishLesson, (state, action) => adapter.updateOne({
    id: action.lessonId,
    changes: {
      status: "draft"
    }
  },state ))


);

function calculateSectionChanges(lessons: Lesson[], sectionId:string): Update<Lesson>[] {
  let lessonSeqNoCounter = 1;

  const reorderChanges: Update<Lesson>[] = [];

  lessons.forEach(lesson => {

    let changes: Partial<Lesson>;

    if (lesson.seqNo != lessonSeqNoCounter) {
      changes = {
        seqNo: lessonSeqNoCounter
      };
    }

    if (lesson.sectionId != sectionId) {
      if (changes) {
        changes.sectionId = sectionId;
      }
      else {
        changes = {
          sectionId
        }
      }
    }

    if (changes) {
      reorderChanges.push({id: lesson.id, changes});
    }

    lessonSeqNoCounter++;

  });

  return reorderChanges

}


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();







