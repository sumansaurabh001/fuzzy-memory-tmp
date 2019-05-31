import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Course} from '../models/course.model';
import {createSelector, select, Store} from '@ngrx/store';
import {isConnectedToStripe, selectActiveCourse, selectActiveCourseAllLessons} from '../store/selectors';
import {AppState} from '../store';
import {Lesson} from '../models/lesson.model';


const selectPublishCourseData = createSelector(
  selectActiveCourse,
  selectActiveCourseAllLessons,
  isConnectedToStripe,
  (course, lessons, connected) => {return {course, lessons, connected}}
);


@Component({
  selector: 'publish-course',
  templateUrl: './publish-course.component.html',
  styleUrls: ['./publish-course.component.scss']
})
export class PublishCourseComponent implements OnInit {

  data$: Observable<{
    course: Course,
    lessons: Lesson[],
    connected
  }>;



  constructor(
    private store: Store<AppState>) {

  }

  ngOnInit() {

    this.data$ = this.store.pipe(select(selectPublishCourseData));

  }

}
