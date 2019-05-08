import {createEntityAdapter, EntityAdapter, EntityState, Update} from '@ngrx/entity';
import {Lesson} from '../models/lesson.model';
import {LessonActions, LessonActionTypes} from './lesson.actions';
import {compareLessons, sortLessonsBySectionAndSeqNo} from '../common/sort-model';
import {moveItemInArray, CdkDragSortEvent} from '@angular/cdk/drag-drop';


export interface State extends EntityState<Lesson> {
  loadedCourses: { [key: string]: boolean },
  activeLessonId: string,
  pendingLessonReordering: Update<Lesson>[]
}

export const adapter: EntityAdapter<Lesson> = createEntityAdapter<Lesson>({
  sortComparer: compareLessons
});

export const initialState: State = adapter.getInitialState({
  loadedCourses: {},
  activeLessonId: undefined,
  pendingLessonReordering: []
});

export function reducer(
  state = initialState,
  action: LessonActions
): State {
  switch (action.type) {
    case LessonActionTypes.WatchLesson: {
      return {
        ...state,
        activeLessonId: action.payload.lessonId
      };
    }
    case LessonActionTypes.AddLesson: {
      return adapter.addOne(action.payload.lesson, state);
    }

    case LessonActionTypes.AddLessons: {

      const lessons = adapter.addMany(action.payload.lessons, state);

      const newState = {
        ...lessons,
        loadedCourses: {...state.loadedCourses}
      };

      newState.loadedCourses[action.payload.courseId] = true;

      return newState;
    }

    case LessonActionTypes.UpdateLesson: {
      return adapter.updateOne(action.payload.lesson, state);
    }

    case LessonActionTypes.DeleteLesson: {
      return adapter.removeOne(action.payload.id, state);
    }

    case LessonActionTypes.LoadLessonVideo: {
      return adapter.updateOne(action.payload.update, state);
    }

    case LessonActionTypes.UpdateLessonOrder: {

      const
        courseSectionIds = action.payload.sections.map(section => section.id),
        courseAllLessons = Object.values(state.entities).filter(lesson => courseSectionIds.includes(lesson.sectionId)),
        courseSortedLessons = sortLessonsBySectionAndSeqNo(courseAllLessons, action.payload.sections),
        movedLesson = {...courseSortedLessons[action.payload.previousIndex]},
        oldSectionId = movedLesson.sectionId,
        newSectionId = courseSortedLessons[action.payload.currentIndex].sectionId;

      // move the drag-and-dropped lesson
      moveItemInArray(courseSortedLessons, action.payload.previousIndex, action.payload.currentIndex);

      let lessonSeqNoCounter = 1;

      const reorderChanges: Update<Lesson>[] = [];

      courseSortedLessons.filter(lesson => lesson.sectionId == newSectionId).forEach(lesson => {

        if (lesson.seqNo != lessonSeqNoCounter) {

          const changes: Partial<Lesson> = {
            seqNo: lessonSeqNoCounter
          };

          if (lesson.id == movedLesson.id && oldSectionId != newSectionId) {
            changes.sectionId = newSectionId;
          }

          reorderChanges.push({id: lesson.id, changes})

        }

        lessonSeqNoCounter++;

      });

      return adapter.updateMany(reorderChanges, {...state, pendingLessonReordering: reorderChanges});

    }

    case LessonActionTypes.UpdateLessonOrderCompleted:
      return {
        ...state,
        pendingLessonReordering: []
      };

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();







