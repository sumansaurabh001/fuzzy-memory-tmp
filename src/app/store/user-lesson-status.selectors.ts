import {createFeatureSelector, createSelector} from '@ngrx/store';
import {UserLessonStatusState} from './user-lesson-status.reducer';
import {selectActiveCourse, selectAllLessons} from './selectors';



export const selectUserLessonStatusState = createFeatureSelector<UserLessonStatusState>('userLessonStatus');


export const selectActiveCourseLessonsWatched = createSelector(
  selectUserLessonStatusState,
  selectActiveCourse,
  (userLessonsStatus,course) => Object.values(userLessonsStatus.entities)
                                    .filter(userLessonsStatus => userLessonsStatus.courseId == course.id && userLessonsStatus.watched)
                                    .map(userLessonsStatus => userLessonsStatus.id)

);



export const selectCoursesWithLessonViewedStatusLoaded = createSelector(
  selectUserLessonStatusState,
  state => state.coursesLoaded
);

