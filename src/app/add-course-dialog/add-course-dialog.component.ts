import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {URL_PATH_REGEX} from '../common/regex';
import {MessagesService} from '../services/messages.service';
import {Course} from '../models/course.model';
import {Store} from '@ngrx/store';
import {AppState} from '../reducers';
import {AddCourse} from '../actions/course.actions';


@Component({
  selector: 'add-course-dialog',
  templateUrl: './add-course-dialog.component.html',
  styleUrls: ['./add-course-dialog.component.scss'],
  providers: [
    MessagesService
  ]
})
export class AddCourseDialogComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<AddCourseDialogComponent>,
              private store:Store<AppState>) {


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
    course.status = 'draft';

    // this.store.dispatch();


/*
   this.coursesService.createNewCourse(course)
      .subscribe(() => {
          this.router.navigate(['courses', course.url, 'edit']);
          this.dialogRef.close();
        },
        err => this.messages.error(err));

*/
  }


}
