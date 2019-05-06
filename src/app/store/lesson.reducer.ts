import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Lesson} from '../models/lesson.model';
import {LessonActions, LessonActionTypes} from './lesson.actions';


export interface State extends EntityState<Lesson> {
  loadedCourses: {[key:string]:boolean},
  activeLessonId: string;
}

export const adapter: EntityAdapter<Lesson> = createEntityAdapter<Lesson>();

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
       }
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



export function sortLessonsBySeqNo(l1: Lesson, l2:Lesson) {
  return l1.seqNo - l2.seqNo;
}




