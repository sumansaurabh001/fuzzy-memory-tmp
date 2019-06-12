import {createEntityAdapter, EntityAdapter, EntityState, Update} from '@ngrx/entity';
import {CourseSection} from '../models/course-section.model';
import {compareCourses, compareSections} from '../common/sort-model';
import {Course} from '../models/course.model';
import {createReducer, on} from '@ngrx/store';
import {CourseSectionActions} from './action-types';


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

export const courseSectionsReducer = createReducer(
  initialState,

  on(CourseSectionActions.addCourseSection, (state, {courseSection}) => adapter.addOne(courseSection, state)),

  on(CourseSectionActions.courseSectionsLoaded, (state, {courseSections, courseId}) => {
    const sections = adapter.addMany(courseSections, state);

    const newState = {
      ...sections,
      loadedCourses: {...state.loadedCourses}
    };

    newState.loadedCourses[courseId] = true;

    return newState;
  }),

  on(CourseSectionActions.updateCourseSection, (state, {courseSection}) => adapter.updateOne(courseSection, state)),

  on(CourseSectionActions.deleteCourseSection, (state, {id}) => adapter.removeOne(id, state)),

  on(CourseSectionActions.updateSectionOrder, (state, {newSortOrder}) => {

    const newSortedSections = newSortOrder;

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

  }),

  on(CourseSectionActions.updateSectionOrderCompleted, state => {
    return {
      ...state,
      pendingSectionsReordering: []
    };
  })

);



export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
