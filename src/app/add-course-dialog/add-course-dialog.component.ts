import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {URL_PATH_REGEX} from '../common/regex';
import {MessagesService} from '../services/messages.service';
import {Course} from '../models/course.model';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import {AddCourse} from '../store/course.actions';
import {CoursesDBService} from '../services/courses-db.service';
import {LoadingService} from '../services/loading.service';



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
              private router: Router,
              private store: Store<AppState>,
              private loading: LoadingService,
              private coursesDB: CoursesDBService,
              private messages: MessagesService) {


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
    course.status = 'draft';
    course.downloadAllowed = true;
    course.includedInSubscription = true;
    course.free = false;

    this.loading.showLoader(this.coursesDB.createNewCourse(course))
      .subscribe(course => {

          this.store.dispatch(new AddCourse({course}));

          this.router.navigate(['courses', course.url, 'edit']);
          this.dialogRef.close();
        },
        err => this.messages.error(err));

  }


}
