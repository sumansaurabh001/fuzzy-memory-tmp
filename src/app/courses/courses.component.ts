import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AddCourseDialogComponent} from '../add-course-dialog/add-course-dialog.component';
import {Router} from '@angular/router';

@Component({
  selector: 'courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {


  constructor(private dialog: MatDialog, private router: Router) {

  }

  ngOnInit() {

  }


  addNewCourse() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(AddCourseDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      url => this.router.navigate(['courses', url, 'edit']));
  }

}
