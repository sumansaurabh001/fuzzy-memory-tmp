import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Course} from '../models/course.model';
import {createSelector, select, Store} from '@ngrx/store';
import {isConnectedToStripe, selectActiveCourse, selectActiveCourseAllLessons, selectActiveCourseDescription} from '../store/selectors';
import {AppState} from '../store';
import {Lesson} from '../models/lesson.model';


const selectPublishCourseData = createSelector(
  selectActiveCourse,
  selectActiveCourseAllLessons,
  isConnectedToStripe,
  selectActiveCourseDescription,
  (course, lessons, connected, longDescription) => {return {course, lessons, connected, longDescription}}
);

interface PublishCoursePageData {
  course: Course,
  lessons: Lesson[],
  connected: boolean,
  longDescription:string
}


@Component({
  selector: 'publish-course',
  templateUrl: './publish-course.component.html',
  styleUrls: ['./publish-course.component.scss']
})
export class PublishCourseComponent implements OnInit {

  data$: Observable<PublishCoursePageData>;

  constructor(private store: Store<AppState>) {

  }

  ngOnInit() {

    this.data$ = this.store.pipe(select(selectPublishCourseData));

  }

  isCourseTitleSet(data: PublishCoursePageData) {
    return !!data.course.title;
  }


  isCourseSubTitleSet(data: PublishCoursePageData) {
    return !!data.course.subTitle;
  }


  isCoursePriceSet(data: PublishCoursePageData) {
    return !!data.course.price;
  }

  isStripeConnectionActive(data: PublishCoursePageData) {
    return data.connected;
  }

  isCourseLongDescriptionSet(data: PublishCoursePageData) {
    return !!data.longDescription;
  }

  areCourseVideosUploaded(data: PublishCoursePageData) {
    return data.lessons && data.lessons.length > 0;
  }

  isCoursePublishable(data: PublishCoursePageData) {
    return this.isCourseTitleSet(data) &&
            this.isCourseSubTitleSet(data) &&
            this.isCoursePriceSet(data) &&
            this.isStripeConnectionActive(data) &&
            this.isCourseLongDescriptionSet(data) &&
            this.areCourseVideosUploaded(data);
  }

}
