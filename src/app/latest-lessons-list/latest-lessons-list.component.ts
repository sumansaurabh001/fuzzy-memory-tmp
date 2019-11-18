import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {Lesson} from '../models/lesson.model';
import {isAnonymousUser, User} from '../models/user.model';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/internal/Observable';
import {isAllLatestLessonsLoaded, selectAllLatestLessons, selectLatestLessonsSortOrder} from '../store/latest-lessons.selectors';
import {LatestLesson} from '../models/latest-lesson.model';
import {isLoggedIn, selectAllCourses} from '../store/selectors';
import {combineLatest, fromEvent} from 'rxjs';
import {debounceTime, filter, map, switchMap, tap} from 'rxjs/operators';
import {changeLatestLessonsSortOrder, loadNextLatestLessonsPage, navigateToLesson} from '../store/latest-lesson.actions';
import {MatAutocompleteSelectedEvent, MatCheckboxChange} from '@angular/material';
import {UserLessonStatus} from '../models/user-lesson-status';
import {updateLessonWatchStatus} from '../store/user-lesson-status.actions';
import {MessagesService} from '../services/messages.service';
import {selectActiveCourseLessonsWatched, selectAllLessonsWatched} from '../store/user-lesson-status.selectors';
import OrderByDirection = firebase.firestore.OrderByDirection;

import {from} from 'rxjs/internal/observable/from';
import {TenantService} from '../services/tenant.service';

interface LatestLessonsListData {
  latestLessons: LatestLesson[];
  courses: Course[];
  isAllLatestLessonsLoaded:boolean;
  isLoggedIn: boolean;
  lessonsWatched:string[];
  sortOrder: "desc" | "asc";
}


@Component({
  selector: 'latest-lessons-list',
  templateUrl: './latest-lessons-list.component.html',
  styleUrls: ['./latest-lessons-list.component.scss']
})
export class LatestLessonsListComponent implements OnInit {

  @Input() title:string;

  data$: Observable<LatestLessonsListData>;


  constructor(
    private store:Store<AppState>,
    private messages: MessagesService,
    private tenant: TenantService) {

  }

  ngOnInit() {

    const latestLessons$ = this.store.pipe(select(selectAllLatestLessons));

    const courses$ = this.store.pipe(select(selectAllCourses));

    const isAllLatestLessonsLoaded$ = this.store.pipe(select(isAllLatestLessonsLoaded));

    const isLoggedIn$ = this.store.pipe(select(isLoggedIn));

    const lessonsWatched$ = this.store.pipe(select(selectAllLessonsWatched));

    const sortOrder$ = this.store.pipe(select(selectLatestLessonsSortOrder));

    this.data$ = combineLatest([latestLessons$, courses$, isAllLatestLessonsLoaded$, isLoggedIn$, lessonsWatched$, sortOrder$])
      .pipe(
        map(([latestLessons, courses, isAllLatestLessonsLoaded, isLoggedIn, lessonsWatched, sortOrder]) => {
          return {latestLessons, courses, isAllLatestLessonsLoaded, isLoggedIn, lessonsWatched, sortOrder}
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
    this.store.dispatch(navigateToLesson({
      courseId: lesson.courseId,
      sectionId: lesson.sectionId,
      seqNo: lesson.seqNo
    }));
  }

  selectSortOrder(sortOrder: OrderByDirection) {
    this.store.dispatch(changeLatestLessonsSortOrder({sortOrder}));
  }

  isSortOrderActive(activeSortOrder: string, buttonSortOrder: string) {
    if (activeSortOrder == buttonSortOrder) {
      return "is-active";
    }
    else return [];
  }

  onSearchLessonSelected(searchResult: any) {

    this.store.dispatch(navigateToLesson({
      courseId: searchResult.courseId,
      sectionId: searchResult.sectionId,
      seqNo: searchResult.seqNo
    }));

  }

  lessonsIndexName() {
    return this.tenant.id + "_lessons";
  }
}
