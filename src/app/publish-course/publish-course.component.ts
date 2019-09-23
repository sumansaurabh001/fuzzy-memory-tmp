import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Course} from '../models/course.model';
import {createSelector, select, Store} from '@ngrx/store';
import {
  isConnectedToStripe,
  selectActiveCourse,
  selectActiveCourseAllLessons,
  selectActiveCourseDescription,
  selectTenantInfo
} from '../store/selectors';
import {AppState} from '../store';
import {Lesson} from '../models/lesson.model';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {PublishCourseDialogComponent} from '../publish-course-dialog/publish-course-dialog.component';
import {TenantInfo} from '../models/tenant.model';
import {filter, tap} from 'rxjs/operators';
import {MessagesService} from '../services/messages.service';
import {Router} from '@angular/router';


const selectPublishCourseData = createSelector(
  selectActiveCourse,
  selectActiveCourseAllLessons,
  isConnectedToStripe,
  selectActiveCourseDescription,
  selectTenantInfo,
  (course, lessons, connected, longDescription, tenantInfo) => {return {course, lessons, connected, longDescription, tenantInfo}}
);

interface PublishCoursePageData {
  course: Course,
  lessons: Lesson[],
  connected: boolean,
  longDescription:string,
  tenantInfo: TenantInfo
}


@Component({
  selector: 'publish-course',
  templateUrl: './publish-course.component.html',
  styleUrls: ['./publish-course.component.scss']
})
export class PublishCourseComponent implements OnInit {

  data$: Observable<PublishCoursePageData>;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private messages: MessagesService,
    private router: Router) {

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
    return  data.course && data.course.status == 'draft' &&
            this.isCourseTitleSet(data) &&
            this.isCourseSubTitleSet(data) &&
            this.isCoursePriceSet(data) &&
            this.isStripeConnectionActive(data) &&
            this.isCourseLongDescriptionSet(data) &&
            this.areCourseVideosUploaded(data);
  }

  publishCourse(course: Course, tenantInfo: TenantInfo) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = '600px';
    dialogConfig.data = {
      courseId: course.id,
      subDomain: tenantInfo.subDomain
    };

    const dialogRef = this.dialog.open(PublishCourseDialogComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter(result => !!result),
        tap(() => this.messages.info("Congratulations, your course is now published.") )
      )
      .subscribe(newUrl => {

        this.router.navigateByUrl(`/courses/${newUrl}/edit`);

      });


  }

  isCourseDraft(data: PublishCoursePageData) {
    return data.course && data.course.status == 'draft';
  }
}
