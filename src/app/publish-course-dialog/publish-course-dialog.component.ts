import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppState} from '../store';
import {Store} from '@ngrx/store';
import {coursePublished} from '../store/course.actions';

@Component({
  selector: 'publish-course-dialog',
  templateUrl: './publish-course-dialog.component.html',
  styleUrls: ['./publish-course-dialog.component.scss']
})
export class PublishCourseDialogComponent implements OnInit {

  form:FormGroup;
  courseId:string;
  subDomain:string;

  constructor(
    private dialogRef: MatDialogRef<PublishCourseDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data,
    private store: Store<AppState>) {

    this.courseId = data.courseId;
    this.subDomain = data.subDomain;

    this.form = fb.group({
      url: ['', [Validators.required, Validators.minLength(5), Validators.pattern("^[a-z0-9\-]+$")]]
    });

  }

  ngOnInit() {

  }

  urlCharsOnly() {
    return this.form.get('url').errors && this.form.get('url').errors.pattern;
  }

  cancel() {
    this.dialogRef.close();
  }

  publish() {

    const url = this.form.value.url;

    this.store.dispatch(coursePublished({url, courseId: this.courseId}));

    this.dialogRef.close(url);

  }

}
