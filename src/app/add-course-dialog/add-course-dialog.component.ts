import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {URL_PATH_REGEX} from '../common/regex';
import {MessagesService} from '../services/messages.service';
import {Course} from '../models/course.model';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import {CreateNewCourse} from '../store/course.actions';
import {CoursesDBService} from '../services/courses-db.service';
import {LoadingService} from '../services/loading.service';
import {AngularFirestore} from '@angular/fire/firestore';



@Component({
  selector: 'add-course-dialog',
  templateUrl: './add-course-dialog.component.html',
  styleUrls: ['./add-course-dialog.component.scss']
})
export class AddCourseDialogComponent implements OnInit {

  form: FormGroup;

  newCourseSeqNo:number;

  constructor(private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) data,
              private dialogRef: MatDialogRef<AddCourseDialogComponent>,
              private router: Router,
              private store: Store<AppState>,
              private coursesDB: CoursesDBService,
              private afs: AngularFirestore) {


    this.newCourseSeqNo = data.newCourseSeqNo;
  }

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(60)]],
      shortDescription: ['', [Validators.required, Validators.maxLength(105)]]
    });
  }

  close() {
    this.dialogRef.close();
  }

  save() {

    const course = this.form.value as Course;
    course.id = this.afs.createId();
    course.status = 'draft';
    course.downloadAllowed = true;
    course.includedInSubscription = true;
    course.free = false;
    course.seqNo = this.newCourseSeqNo;
    course.totalLessonsPublished = 0;

    // initially the course url is the seqNo, it will be overwritten at publication time
    course.url = '' + this.newCourseSeqNo;

    course.totalDuration = 0;

    this.store.dispatch(new CreateNewCourse({course}));

    this.router.navigate(['courses', course.url, 'edit']);

    this.dialogRef.close();

  }


}
