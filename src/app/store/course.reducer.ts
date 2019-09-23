import {createEntityAdapter, EntityAdapter, EntityState, Update} from '@ngrx/entity';
import {Course} from '../models/course.model';
import {compareCourses} from '../common/sort-model';
import {createReducer, on} from '@ngrx/store';
import {CourseActions} from './action-types';


export interface State extends EntityState<Course> {
  initialCoursesLoaded:boolean;
  activeCourseId: string;
  coursesPurchased: string[];
  pendingCoursesReordering: Update<Course>[];
}

export const adapter: EntityAdapter<Course> = createEntityAdapter<Course>({
  sortComparer: compareCourses
});

export const initialState: State = adapter.getInitialState({
  initialCoursesLoaded:false,
  activeCourseId: undefined,
  coursesPurchased: [],
  pendingCoursesReordering: []
});


export const coursesReducer = createReducer(
  initialState,
  on(CourseActions.loadCourseDetail, (state, { courseId }) => {
    return {...state, activeCourseId: courseId};
  }),
  on(
    CourseActions.courseLoaded,
    CourseActions.createNewCourse,
    (state,{course}) => adapter.addOne(course, state)
  ),

  on(CourseActions.updateCourse, (state,{course}) => adapter.updateOne(course, state)),

  on(CourseActions.deleteCourse, (state, {id}) =>  adapter.removeOne(id, state)),

  on(CourseActions.loadCourses, (state, {courses}) => {
    const newState = adapter.addAll(courses, state);
    newState.initialCoursesLoaded = true;
    return newState;
  }),

  on(CourseActions.coursePurchased, (state, {courseId}) => {
    return {
      ...state,
      coursesPurchased: state.coursesPurchased.concat(courseId)
    };
  }),

  on(CourseActions.userCoursesLoaded, (state, {purchasedCourses}) => {
    return {
      ...state,
      coursesPurchased: [
        ...state.coursesPurchased,
        ...purchasedCourses
      ]
    };
  }),

  on(CourseActions.updateCourseSortOrder, (state, {newSortOrder}) => {
    const newSortedCourses = newSortOrder;

    const reorderCourses: Update<Course>[] = [];

    let seqNoCounter = 1;

    newSortedCourses.forEach(course => {

      if (course.seqNo != seqNoCounter) {

        const changes: Partial<Course> = {
          seqNo: seqNoCounter
        };

        reorderCourses.push({id:course.id, changes});
      }

      seqNoCounter+=1;

    });

    return adapter.updateMany(reorderCourses, {...state, pendingCoursesReordering: reorderCourses});
  }),

  on(CourseActions.updateCourseSortOrderCompleted, state => {
    return {
      ...state,
      pendingCoursesReordering: []
    };
  }),

  on(CourseActions.coursePublished, (state, action) =>
    adapter.updateOne({
      id: action.courseId,
      changes: {
       status: 'published',
       url: action.url
      }
    }, state))


);


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
