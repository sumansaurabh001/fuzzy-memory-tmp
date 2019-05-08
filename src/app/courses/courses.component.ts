import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AddCourseDialogComponent} from '../add-course-dialog/add-course-dialog.component';
import {Observable} from 'rxjs';
import {Course} from '../models/course.model';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {selectAllCourses} from '../store/selectors';
import {moveItemInArray} from '@angular/cdk/drag-drop';
import {CourseSortOrderUpdated} from '../store/course.actions';

@Component({
  selector: 'courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses$: Observable<Course[]>;

  constructor(
    private dialog: MatDialog,
    private store: Store<AppState>) {

  }

  ngOnInit() {

    this.courses$ = this.store.pipe(select(selectAllCourses));

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

    this.store.dispatch(new CourseSortOrderUpdated({newSortOrder}));

  }

  onCourseMovedUp(courses: Course[], movedCourse: Course) {

    const newSortOrder = [...courses];

    const courseIndex = newSortOrder.findIndex(course => course.id == movedCourse.id);

    moveItemInArray(newSortOrder, courseIndex, courseIndex - 1);

    this.store.dispatch(new CourseSortOrderUpdated({newSortOrder}));

  }

}
