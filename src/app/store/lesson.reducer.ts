import {createEntityAdapter, EntityAdapter, EntityState, Update} from '@ngrx/entity';
import {Lesson} from '../models/lesson.model';
import {LessonActions, LessonActionTypes} from './lesson.actions';
import {compareLessons, sortLessonsBySectionAndSeqNo} from '../common/sort-model';


export interface State extends EntityState<Lesson> {
  loadedCourses: { [key: string]: boolean },
  activeLessonId: string
}

export const adapter: EntityAdapter<Lesson> = createEntityAdapter<Lesson>({
  sortComparer: compareLessons
});

export const initialState: State = adapter.getInitialState({
  loadedCourses: {},
  activeLessonId: undefined
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
        replacedLesson = courseSortedLessons[action.payload.currentIndex],
        oldIndex = action.payload.previousIndex,
        newIndex = action.payload.currentIndex,
        oldSectionId = movedLesson.sectionId,
        newSectionId = courseSortedLessons[newIndex].sectionId;

      // move the dropped lesson
      courseSortedLessons.splice(newIndex, 0, movedLesson);
      movedLesson.sectionId = newSectionId;

      // remove the old lesson
      const removeIndex = (courseSortedLessons[oldIndex + 1].id == movedLesson.id) ? (oldIndex + 1) : (oldIndex - 1);

      courseSortedLessons.splice(removeIndex, 1);

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

      return adapter.updateMany(reorderChanges, state);

    }

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







