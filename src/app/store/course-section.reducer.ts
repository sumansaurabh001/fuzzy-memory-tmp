import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {CourseSection} from '../models/course-section.model';
import {CourseSectionActions, CourseSectionActionTypes} from './course-section.actions';
import {compareSections} from '../common/sort-model';


export interface State extends EntityState<CourseSection> {
  loadedCourses: {[key:string]:boolean}
}


export const adapter: EntityAdapter<CourseSection> = createEntityAdapter<CourseSection>({
  sortComparer: compareSections
});


export const initialState: State = adapter.getInitialState({
 loadedCourses: {}
});


export function reducer(
  state = initialState,
  action: CourseSectionActions
): State {
  switch (action.type) {

    case CourseSectionActionTypes.AddCourseSection: {
      return adapter.addOne(action.payload.courseSection, state);
    }

    case CourseSectionActionTypes.AddCourseSections: {

      const sections = adapter.addMany(action.payload.courseSections, state);

      const newState = {
        ...sections,
        loadedCourses: {...state.loadedCourses}
      };

      newState.loadedCourses[action.payload.courseId] = true;

      return newState;
    }

    case CourseSectionActionTypes.UpdateCourseSection: {
      return adapter.updateOne(action.payload.courseSection, state);
    }

    case CourseSectionActionTypes.DeleteCourseSection: {
      return adapter.removeOne(action.payload.id, state);
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
