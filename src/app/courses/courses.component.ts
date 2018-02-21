import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AddCourseDialogComponent} from '../add-course-dialog/add-course-dialog.component';
import {Router} from '@angular/router';
import {CoursesService} from '../services/courses.service';

@Component({
  selector: 'courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {


  constructor(
    private dialog: MatDialog,
    private router: Router,
    private coursesService: CoursesService) {

  }

  ngOnInit() {

    const courses$ = this.coursesService.findAllCourses();

    courses$.subscribe(console.log);

  }


  addNewCourse() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = "500px";

    const dialogRef = this.dialog.open(AddCourseDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      course => {
       if (course) {
         this.router.navigate(['courses', course.url, 'edit']);
       }
      });
  }

}
