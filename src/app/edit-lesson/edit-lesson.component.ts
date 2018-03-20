import {Component, Input, OnInit} from '@angular/core';
import {Lesson} from '../models/lesson.model';
import {State} from '../store';
import {Store} from '@ngrx/store';
import {LessonsDBService} from '../services/lessons-db.service';
import {Course} from '../models/course.model';
import {LoadingService} from '../services/loading.service';
import {DeleteLesson} from '../store/lesson.actions';
import {DangerDialogComponent} from '../danger-dialog/danger-dialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {concatMap, filter, tap} from 'rxjs/operators';

@Component({
  selector: 'edit-lesson',
  templateUrl: './edit-lesson.component.html',
  styleUrls: ['./edit-lesson.component.scss']
})
export class EditLessonComponent implements OnInit {

  @Input() course:Course;
  @Input() lesson: Lesson;

  constructor(
    private dialog: MatDialog,
    private store: Store<State>,
    private loading: LoadingService,
    private lessonsDB: LessonsDBService
  ) {

  }

  ngOnInit() {

  }

  deleteLesson() {

    const config = new MatDialogConfig();

    config.autoFocus = true;

    config.data = {
      title: 'Delete Lesson',
      confirmationText: 'Are you sure you want to delete this lesson?'
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, config);

    dialogRef.afterClosed()
      .pipe(
        filter(result => result.confirm),
        concatMap(() => this.loading.showLoader(this.lessonsDB.deleteLesson(this.course, this.lesson))),
        tap(() => this.store.dispatch(new DeleteLesson({id: this.lesson.id})))
      )
      .subscribe();

  }

}
