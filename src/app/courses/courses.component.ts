import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {AddCourseDialogComponent} from '../add-course-dialog/add-course-dialog.component';
import {Observable, combineLatest} from 'rxjs';
import {Course} from '../models/course.model';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {isAdmin, isLoggedOut, isUserSubscribed, selectAllCourses, selectTenantInfo, selectUserCourses} from '../store/selectors';
import {moveItemInArray} from '@angular/cdk/drag-drop';
import {updateCourseSortOrder} from '../store/course.actions';
import {debounceTime, filter, map, tap} from 'rxjs/operators';
import {arrayDiffById} from '../common/collection-utils';
import {MessagesService} from '../services/messages.service';
import {Title} from '@angular/platform-browser';
import {setSchoolNameAsPageTitle} from '../common/seo-utils';



interface CoursesData {
  isLoggedOut:boolean,
  isAdmin:boolean,
  allCourses: Course[],
  userCourses: Course[],
  isUserSubscribed: boolean
}

@Component({
  selector: 'courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, OnDestroy {

  data$: Observable<CoursesData>;

  infoMessageShown = false;

  constructor(
    private dialog: MatDialog,
    private store: Store<AppState>,
    private messages:MessagesService,
    private title: Title) {

  }

  ngOnInit() {

    const courses$ = this.store.pipe(select(selectAllCourses));

    const isLoggedOut$ = this.store.pipe(
      select(isLoggedOut),
      filter(isLoggedOut => isLoggedOut != undefined)
    );

    const isUserSubscribed$ = this.store.pipe(select(isUserSubscribed));

    const isAdmin$ = this.store.pipe(select(isAdmin));

    const userCourses$ = this.store.pipe(select(selectUserCourses));

    this.data$ = combineLatest([isLoggedOut$, isAdmin$, courses$, userCourses$, isUserSubscribed$])
      .pipe(
        map(([isLoggedOut, isAdmin, allCourses, userCourses, isUserSubscribed]) => {
          return {isLoggedOut, isAdmin, allCourses, userCourses, isUserSubscribed}}),
        tap(userInfo => {
          if (!this.infoMessageShown) {
            if (userInfo.isUserSubscribed) {
             this.messages.info("As a subscriber, you have access to all the courses!");
            }
            this.infoMessageShown = true;
          }

        }),
        debounceTime(10)
      );

    setSchoolNameAsPageTitle(this.store, this.title);

  }

  ngOnDestroy() {
    this.messages.clear();
  }

  addNewCourse(totalCourses: number) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = '500px';
    dialogConfig.data = {
      newCourseSeqNo: totalCourses + 1
    }

    this.dialog.open(AddCourseDialogComponent, dialogConfig);
  }

  onCourseMovedDown(courses: Course[], movedCourse: Course) {

    const newSortOrder = [...courses];

    const courseIndex = newSortOrder.findIndex(course => course.id == movedCourse.id);

    moveItemInArray(newSortOrder, courseIndex, courseIndex + 1);

    this.store.dispatch(updateCourseSortOrder({newSortOrder}));

  }

  onCourseMovedUp(courses: Course[], movedCourse: Course) {

    const newSortOrder = [...courses];

    const courseIndex = newSortOrder.findIndex(course => course.id == movedCourse.id);

    moveItemInArray(newSortOrder, courseIndex, courseIndex - 1);

    this.store.dispatch(updateCourseSortOrder({newSortOrder}));

  }

  availableCourses(allCourses: Course[], userCourses: Course[]) {
    return arrayDiffById(allCourses, userCourses);
  }


  showAllCourses(userInfo: CoursesData) {
    return userInfo.isLoggedOut || userInfo.isAdmin || userInfo.isUserSubscribed;
  }

  showMyCourses(userInfo: CoursesData) {
    return !userInfo.isLoggedOut && (!userInfo.isAdmin && !userInfo.isUserSubscribed);
  }

  displayedCourses(data: CoursesData): Course[] {
    if (!data.isAdmin) {
      return data.allCourses.filter(course => course.status == 'published');
    }
    else {
      return data.allCourses;
    }
  }

}
