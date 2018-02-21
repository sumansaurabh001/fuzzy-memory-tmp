import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {URL_PATH_REGEX} from '../common/regex';
import {CoursesService} from '../services/courses.service';
import {Router} from '@angular/router';
import {Course} from '../../model/course.model';


@Component({
  selector: 'add-course-dialog',
  templateUrl: './add-course-dialog.component.html',
  styleUrls: ['./add-course-dialog.component.scss']
})
export class AddCourseDialogComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<AddCourseDialogComponent>,
              private coursesService:CoursesService,
              private router: Router) {


  }

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(60)]],
      shortDescription: ['', [Validators.required, Validators.maxLength(105)]],
      url: ['', [Validators.required, Validators.pattern(URL_PATH_REGEX)]],
    });
  }

  close() {
    this.dialogRef.close();
  }

  save() {

    const course = this.form.value as Course;

    this.coursesService
      .createNewCourse(this.form.value)
      .subscribe(() => {
        this.router.navigate(['courses', course.url, 'edit']);
        this.dialogRef.close();
      });
  }


}
