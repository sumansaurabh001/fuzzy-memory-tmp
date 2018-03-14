import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AddCourseDialogComponent} from '../add-course-dialog/add-course-dialog.component';
import {Observable} from 'rxjs/Observable';
import {Course} from '../models/course.model';
import {select, Store} from '@ngrx/store';
import {State} from '../store';
import {selectAllCourses} from '../store/course.selectors';

@Component({
  selector: 'courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses$: Observable<Course[]>;

  constructor(
    private dialog: MatDialog,
    private store: Store<State>) {

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

}
