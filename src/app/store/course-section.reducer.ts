import {createEntityAdapter, EntityAdapter, EntityState, Update} from '@ngrx/entity';
import {CourseSection} from '../models/course-section.model';
import {CourseSectionActions, CourseSectionActionTypes} from './course-section.actions';
import {compareCourses, compareSections} from '../common/sort-model';
import {Course} from '../models/course.model';


export interface State extends EntityState<CourseSection> {
  loadedCourses: {[key:string]:boolean};
  pendingSectionsReordering: Update<CourseSection>[]
}


export const adapter: EntityAdapter<CourseSection> = createEntityAdapter<CourseSection>({
  sortComparer: compareSections
});


export const initialState: State = adapter.getInitialState({
 loadedCourses: {},
  pendingSectionsReordering: []
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

    case CourseSectionActionTypes.UpdatedSectionOrder:

      const newSortedSections = action.payload.newSortOrder;

      const reorderSections: Update<CourseSection>[] = [];

      let seqNoCounter = 1;

      newSortedSections.forEach(section => {

        if (section.seqNo != seqNoCounter) {

          const changes: Partial<CourseSection> = {
            seqNo: seqNoCounter
          };

          reorderSections.push({id:section.id, changes});
        }

        seqNoCounter+=1;

      });

      return adapter.updateMany(reorderSections, {...state, pendingSectionsReordering: reorderSections});

    case CourseSectionActionTypes.UpdatedSectionOrderCompleted:

      return {
        ...state,
        pendingSectionsReordering: []
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
