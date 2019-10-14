import { Component, OnInit } from '@angular/core';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {Lesson} from '../models/lesson.model';
import {isAnonymousUser, User} from '../models/user.model';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/internal/Observable';
import {isAllLatestLessonsLoaded, selectAllLatestLessons} from '../store/latest-lessons.selectors';
import {LatestLesson} from '../models/latest-lesson.model';
import {isLoggedIn, selectAllCourses} from '../store/selectors';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {loadNextLatestLessonsPage, navigateToLesson} from '../store/latest-lesson.actions';
import {MatCheckboxChange} from '@angular/material';
import {UserLessonStatus} from '../models/user-lesson-status';
import {updateLessonWatchStatus} from '../store/user-lesson-status.actions';
import {MessagesService} from '../services/messages.service';
import {selectActiveCourseLessonsWatched, selectAllLessonsWatched} from '../store/user-lesson-status.selectors';

interface LatestLessonsListData {
  latestLessons: LatestLesson[];
  courses: Course[];
  isAllLatestLessonsLoaded:boolean;
  isLoggedIn: boolean;
  lessonsWatched:string[];
}


@Component({
  selector: 'latest-lessons-list',
  templateUrl: './latest-lessons-list.component.html',
  styleUrls: ['./latest-lessons-list.component.scss']
})
export class LatestLessonsListComponent implements OnInit {

  data$: Observable<LatestLessonsListData>;

  constructor(
    private store:Store<AppState>,
    private messages: MessagesService) {

  }

  ngOnInit() {

    const latestLessons$ = this.store.pipe(select(selectAllLatestLessons));

    const courses$ = this.store.pipe(select(selectAllCourses));

    const isAllLatestLessonsLoaded$ = this.store.pipe(select(isAllLatestLessonsLoaded));

    const isLoggedIn$ = this.store.pipe(select(isLoggedIn));

    const lessonsWatched$ = this.store.pipe(select(selectAllLessonsWatched));

    this.data$ = combineLatest([latestLessons$, courses$, isAllLatestLessonsLoaded$, isLoggedIn$, lessonsWatched$])
      .pipe(
        map(([latestLessons, courses, isAllLatestLessonsLoaded, isLoggedIn, lessonsWatched]) => {
          return {latestLessons, courses, isAllLatestLessonsLoaded, isLoggedIn, lessonsWatched}
        })
      );

  }

  findCourseListIcon(courseId:string, courses: Course[]) {

    const course = courses.find(course => course.id == courseId);

    return course.lessonIconUrl;

  }

  loadMore() {
    this.store.dispatch(loadNextLatestLessonsPage());
  }

  onCheckBoxToggled(event: MouseEvent) {
    event.stopPropagation();
  }

  onLessonViewedClicked(event: MatCheckboxChange, lesson: LatestLesson, isLoggedIn:boolean) {

    if (!isLoggedIn) {
      this.messages.info("Please login first, in order to mark lessons as viewed.");
      return;
    }

    const userLessonStatus: UserLessonStatus = {
      id: lesson.id,
      courseId: lesson.courseId,
      watched: event.checked
    };

    this.store.dispatch(updateLessonWatchStatus({userLessonStatus}));

  }

  isLessonWatched(lessonsWatched: string[], lesson: LatestLesson) {
    return lessonsWatched.includes(lesson.id);
  }

  navigateToLesson(lesson: LatestLesson) {
    this.store.dispatch(navigateToLesson({lesson}));
  }

}
