import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Lesson } from '../models/lesson.model';
import { LessonActions, LessonActionTypes } from './lesson.actions';

export interface State extends EntityState<Lesson> {
  loadedCourses: {[key:string]:boolean}
}

export const adapter: EntityAdapter<Lesson> = createEntityAdapter<Lesson>();

export const initialState: State = adapter.getInitialState({
  loadedCourses: {}
});

export function reducer(
  state = initialState,
  action: LessonActions
): State {
  switch (action.type) {
    case LessonActionTypes.AddLesson: {
      return adapter.addOne(action.payload.lesson, state);
    }

    case LessonActionTypes.UpsertLesson: {
      return adapter.upsertOne(action.payload.lesson, state);
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

    case LessonActionTypes.UpsertLessons: {
      return adapter.upsertMany(action.payload.lessons, state);
    }

    case LessonActionTypes.UpdateLesson: {
      return adapter.updateOne(action.payload.lesson, state);
    }

    case LessonActionTypes.UpdateLessons: {
      return adapter.updateMany(action.payload.lessons, state);
    }

    case LessonActionTypes.DeleteLesson: {
      return adapter.removeOne(action.payload.id, state);
    }

    case LessonActionTypes.DeleteLessons: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case LessonActionTypes.AddAllLessons: {
      return adapter.addAll(action.payload.lessons, state);
    }

    case LessonActionTypes.ClearLessons: {
      return adapter.removeAll(state);
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
