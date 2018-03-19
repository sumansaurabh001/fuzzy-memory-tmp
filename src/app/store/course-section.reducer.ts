import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CourseSection } from '../models/course-section.model';
import { CourseSectionActions, CourseSectionActionTypes } from './course-section.actions';


export interface State extends EntityState<CourseSection> {

}


export const adapter: EntityAdapter<CourseSection> = createEntityAdapter<CourseSection>();


export const initialState: State = adapter.getInitialState({

});


export function reducer(
  state = initialState,
  action: CourseSectionActions
): State {
  switch (action.type) {
    case CourseSectionActionTypes.AddCourseSection: {
      return adapter.addOne(action.payload.courseSection, state);
    }

    case CourseSectionActionTypes.UpsertCourseSection: {
      return adapter.upsertOne(action.payload.courseSection, state);
    }

    case CourseSectionActionTypes.AddCourseSections: {
      return adapter.addMany(action.payload.courseSections, state);
    }

    case CourseSectionActionTypes.UpsertCourseSections: {
      return adapter.upsertMany(action.payload.courseSections, state);
    }

    case CourseSectionActionTypes.UpdateCourseSection: {
      return adapter.updateOne(action.payload.courseSection, state);
    }

    case CourseSectionActionTypes.UpdateCourseSections: {
      return adapter.updateMany(action.payload.courseSections, state);
    }

    case CourseSectionActionTypes.DeleteCourseSection: {
      return adapter.removeOne(action.payload.id, state);
    }

    case CourseSectionActionTypes.DeleteCourseSections: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case CourseSectionActionTypes.LoadCourseSections: {
      return adapter.addAll(action.payload.courseSections, state);
    }

    case CourseSectionActionTypes.ClearCourseSections: {
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
