import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AddCourseDialogComponent} from '../add-course-dialog/add-course-dialog.component';
import {Observable, combineLatest} from 'rxjs';
import {Course} from '../models/course.model';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {isAdmin, isLoggedOut, selectAllCourses, selectUserCourses} from '../store/selectors';
import {moveItemInArray} from '@angular/cdk/drag-drop';
import {UpdateCourseSortOrder} from '../store/course.actions';
import { map} from 'rxjs/operators';

@Component({
  selector: 'courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  userInfo$: Observable<{isLoggedOut:boolean, isAdmin:boolean, allCourses: Course[], userCourses: Course[]}>;

  constructor(
    private dialog: MatDialog,
    private store: Store<AppState>) {

  }

  ngOnInit() {

    const courses$ = this.store.pipe(select(selectAllCourses));

    const isLoggedOut$ = this.store.pipe(select(isLoggedOut));

    const isAdmin$ = this.store.pipe(select(isAdmin));

    const userCourses$ = this.store.pipe(select(selectUserCourses));

    this.userInfo$ = combineLatest([isLoggedOut$, isAdmin$, courses$, userCourses$])
      .pipe(
        map(([isLoggedOut, isAdmin, allCourses, userCourses]) => {return {isLoggedOut, isAdmin, allCourses, userCourses}})
      );

  }

  addNewCourse() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = '500px';

    this.dialog.open(AddCourseDialogComponent, dialogConfig);
  }

  onCourseMovedDown(courses: Course[], movedCourse: Course) {

    const newSortOrder = [...courses];

    const courseIndex = newSortOrder.findIndex(course => course.id == movedCourse.id);

    moveItemInArray(newSortOrder, courseIndex, courseIndex + 1);

    this.store.dispatch(new UpdateCourseSortOrder({newSortOrder}));

  }

  onCourseMovedUp(courses: Course[], movedCourse: Course) {

    const newSortOrder = [...courses];

    const courseIndex = newSortOrder.findIndex(course => course.id == movedCourse.id);

    moveItemInArray(newSortOrder, courseIndex, courseIndex - 1);

    this.store.dispatch(new UpdateCourseSortOrder({newSortOrder}));

  }

}
