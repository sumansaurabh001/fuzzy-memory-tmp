import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Course } from '../models/course.model';
import { CourseActions, CourseActionTypes } from './course.actions';




export interface State extends EntityState<Course> {
  editedCourseId: string;
}

export const adapter: EntityAdapter<Course> = createEntityAdapter<Course>();

export const initialState: State = adapter.getInitialState({
  editedCourseId: undefined
});

export function reducer(
  state = initialState,
  action: CourseActions
): State {

  switch (action.type) {
    case CourseActionTypes.EditCourse: {
      return {...state, editedCourseId: action.payload.editedCourseId};
    }
    case CourseActionTypes.AddCourse: {
      return adapter.addOne(action.payload.course, state);
    }

    case CourseActionTypes.UpsertCourse: {
      return adapter.upsertOne(action.payload.course, state);
    }

    case CourseActionTypes.AddCourses: {
      return adapter.addMany(action.payload.courses, state);
    }

    case CourseActionTypes.UpsertCourses: {
      return adapter.upsertMany(action.payload.courses, state);
    }

    case CourseActionTypes.UpdateCourse: {
      return adapter.updateOne(action.payload.course, state);
    }

    case CourseActionTypes.UpdateCourses: {
      return adapter.updateMany(action.payload.courses, state);
    }

    case CourseActionTypes.DeleteCourse: {
      return adapter.removeOne(action.payload.id, state);
    }

    case CourseActionTypes.DeleteCourses: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case CourseActionTypes.LoadCourses: {
      return adapter.addAll(action.payload.courses, state);
    }

    case CourseActionTypes.ClearCourses: {
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
