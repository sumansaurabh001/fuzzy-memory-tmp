import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AddCourse} from '../store/course.actions';
import {LoadingService} from '../services/loading.service';
import {LessonsDBService} from '../services/lessons-db.service';
import {AddCourseSection, UpdateCourseSection} from '../store/course-section.actions';
import {AppState} from '../store';
import {Store} from '@ngrx/store';
import {MessagesService} from '../services/messages.service';
import {Course} from '../models/course.model';
import {CourseSection} from '../models/course-section.model';
import {UpdateStr} from '@ngrx/entity/src/models';

@Component({
  selector: 'edit-section-dialog',
  templateUrl: './edit-section-dialog.component.html',
  styleUrls: ['./edit-section-dialog.component.scss'],
  providers: [
    MessagesService
  ]
})
export class EditSectionDialogComponent implements OnInit {

  course:Course;
  section: CourseSection;

  titleText:string;

  constructor(private dialogRef: MatDialogRef<EditSectionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private loading: LoadingService,
              private lessonsDB: LessonsDBService,
              private store: Store<AppState>,
              private messages: MessagesService) {

    this.course = data.course;
    this.section = data.section;

    this.titleText = this.section.title;

  }

  ngOnInit() {

  }

  close() {
    this.dialogRef.close();
  }

  save() {

    const update: UpdateStr<CourseSection> = {
      id: this.section.id,
      changes: {title: this.titleText}
    };

    this.loading.showLoader(this.lessonsDB.saveSection(this.course.id, this.section.id, update))
      .subscribe(
        () => {
          this.store.dispatch(new UpdateCourseSection({courseSection: update}));
          this.dialogRef.close();
        },
        err => this.messages.error(err)
      );
  }

}
