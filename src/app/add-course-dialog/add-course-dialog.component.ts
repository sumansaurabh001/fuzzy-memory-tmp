import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {URL_PATH_REGEX} from '../common/regex';
import {CoursesService} from '../services/courses.service';
import {Router} from '@angular/router';
import {Course} from '../../model/course.model';
import {LoadingService} from '../services/loading.service';
import {MessagesService} from '../services/messages.service';



@Component({
  selector: 'add-course-dialog',
  templateUrl: './add-course-dialog.component.html',
  styleUrls: ['./add-course-dialog.component.scss'],
  providers: [
    LoadingService,
    MessagesService
  ]
})
export class AddCourseDialogComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<AddCourseDialogComponent>,
              private coursesService:CoursesService,
              private router: Router,
              private loading: LoadingService,
              private messages: MessagesService) {


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

    const newCourse$ = this.loading.showLoaderWhileBusy(this.coursesService.createNewCourse(course));

    newCourse$.subscribe(() => {
        this.router.navigate(['courses', course.url, 'edit']);
        this.dialogRef.close();
      },
      err => this.messages.showError('Error creating the new course.', err));
  }


}
