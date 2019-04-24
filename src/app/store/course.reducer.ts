import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Course} from '../models/course.model';
import {CourseActions, CourseActionTypes} from './course.actions';


export interface State extends EntityState<Course> {
  initialCoursesLoaded:boolean;
  activeCourseId: string;
  coursesPurchased: string[];
}

export const adapter: EntityAdapter<Course> = createEntityAdapter<Course>();

export const initialState: State = adapter.getInitialState({
  initialCoursesLoaded:false,
  activeCourseId: undefined,
  coursesPurchased: []
});

export function coursesReducer(
  state = initialState,
  action: CourseActions
): State {

  switch (action.type) {
    case CourseActionTypes.LoadCourseDetail: {
      return {...state, activeCourseId: action.payload.courseId};
    }
    case CourseActionTypes.AddCourse: {
      return adapter.addOne(action.payload.course, state);
    }

    case CourseActionTypes.AddCourses: {
      return adapter.addMany(action.payload.courses, state);
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
      const newState = adapter.addAll(action.payload.courses, state);
      newState.initialCoursesLoaded = true;
      return newState;
    }

    case CourseActionTypes.ClearCourses: {
      return adapter.removeAll(state);
    }

    case CourseActionTypes.CoursePurchased: {
      return {
        ...state,
        coursesPurchased: state.coursesPurchased.concat(action.payload.courseId)
      };
    }

    case CourseActionTypes.UserCoursesLoaded: {
      return {
        ...state,
        coursesPurchased: [
          ...state.coursesPurchased,
          ...action.payload.purchasedCourses
        ]
      };
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
