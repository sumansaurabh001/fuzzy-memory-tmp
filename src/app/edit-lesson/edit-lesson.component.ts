import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Lesson} from '../models/lesson.model';
import {State} from '../store';
import {Store} from '@ngrx/store';
import {LessonsDBService} from '../services/lessons-db.service';
import {Course} from '../models/course.model';
import {LoadingService} from '../services/loading.service';
import {DeleteLesson, UpdateLesson} from '../store/lesson.actions';
import {DangerDialogComponent} from '../danger-dialog/danger-dialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {concatMap, filter, tap} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UpdateCourse} from '../store/course.actions';
import {defaultHtmlEditorConfig} from '../common/html-editor.config';
import {SaveDescription} from '../store/description.actions';
import {FileUploadService} from '../services/file-upload.service';

@Component({
  selector: 'edit-lesson',
  templateUrl: './edit-lesson.component.html',
  styleUrls: ['./edit-lesson.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditLessonComponent implements OnInit, OnChanges {

  @Input() course:Course;
  @Input() lesson: Lesson;

  form: FormGroup;

  lessonDescription:string;
  toolbar = defaultHtmlEditorConfig;

  constructor(
    private dialog: MatDialog,
    private store: Store<State>,
    private loading: LoadingService,
    private lessonsDB: LessonsDBService,
    private fb: FormBuilder,
    private upload: FileUploadService) {

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(60)]],
      free: [false, [Validators.required]],

    });

  }

  ngOnInit() {


  }

  ngOnChanges(changes:SimpleChanges) {
    if (changes['lesson']) {
      this.form.patchValue(changes['lesson'].currentValue);
    }
  }

  isDraft() {
    return this.lesson && this.lesson.status === 'draft';

  }

  isReady() {
    return this.lesson && this.lesson.status === 'ready';
  }

  isPublished() {
    return this.lesson && this.lesson.status === 'published';
  }


  saveLesson() {
    const lesson = {
      id: this.lesson.id,
      changes: {...this.form.value}
    };

    this.store.dispatch(new UpdateLesson({lesson, courseId: this.course.id}));

    const description = this.lessonDescription || '';

    this.store.dispatch(new SaveDescription({id: this.lesson.id, description}));
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
        concatMap(() => this.loading.showLoader(this.lessonsDB.deleteLesson(this.course.id, this.lesson.id))),
        tap(() => this.store.dispatch(new DeleteLesson({id: this.lesson.id})))
      )
      .subscribe();

  }

  onFileSelected(event) {

    const video = event.target.files[0];

    if (video) {
      (this.upload.uploadVideo(this.course.id, video))
        .pipe(
          tap(percent => {
            console.log(percent);
          })
        )
        .subscribe();
    }

  }



}
