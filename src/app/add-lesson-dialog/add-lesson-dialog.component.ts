import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {LoadingService} from '../services/loading.service';
import {MessagesService} from '../services/messages.service';
import {AddSectionDialogComponent} from '../add-section-dialog/add-section-dialog.component';
import {AppState} from '../store';
import {LessonsDBService} from '../services/lessons-db.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Course} from '../models/course.model';
import {Store} from '@ngrx/store';
import {CourseSection} from '../models/course-section.model';
import {AddLesson} from '../store/lesson.actions';


@Component({
  selector: 'add-lesson-dialog',
  templateUrl: './add-lesson-dialog.component.html',
  styleUrls: ['./add-lesson-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MessagesService
  ]
})
export class AddLessonDialogComponent {

  course:Course;
  section:CourseSection;

  constructor(private dialogRef: MatDialogRef<AddSectionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private loading: LoadingService,
              private lessonsDB: LessonsDBService,
              private store: Store<AppState>,
              private messages: MessagesService) {

    this.course = data.course;
    this.section = data.section;

  }


  close() {
    this.dialogRef.close();
  }


  save(title: string) {

    this.loading.showLoader(this.lessonsDB.addNewLesson(this.course.id, this.section.id, title))
      .subscribe(
        lesson => {
          this.store.dispatch(new AddLesson({lesson}));
          this.dialogRef.close();
        },
        err => this.messages.error(err)
      );
  }

}
