import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AddCourse} from '../store/course.actions';
import {LoadingService} from '../services/loading.service';
import {LessonsDBService} from '../services/lessons-db.service';
import {AddCourseSection} from '../store/course-section.actions';
import {State} from '../store';
import {Store} from '@ngrx/store';
import {MessagesService} from '../services/messages.service';
import {Course} from '../models/course.model';

@Component({
  selector: 'add-section-dialog',
  templateUrl: './add-section-dialog.component.html',
  styleUrls: ['./add-section-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MessagesService
  ]
})
export class AddSectionDialogComponent implements OnInit {

  course:Course;

  constructor(private dialogRef: MatDialogRef<AddSectionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private loading: LoadingService,
              private lessonsDB: LessonsDBService,
              private store: Store<State>,
              private messages: MessagesService) {

    this.course = data.course;

  }

  ngOnInit() {

  }

  close() {
    this.dialogRef.close();
  }

  save(title: string) {

    this.loading.showLoader(this.lessonsDB.addNewSection(this.course, title))
      .subscribe(
        courseSection => {
          this.store.dispatch(new AddCourseSection({courseSection}));
          this.dialogRef.close();
        },
        err => this.messages.error(err)
      );
  }

}
