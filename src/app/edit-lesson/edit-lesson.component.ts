import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Lesson} from '../models/lesson.model';
import {AppState} from '../store';
import {Store} from '@ngrx/store';
import {LessonsDBService} from '../services/lessons-db.service';
import {Course} from '../models/course.model';
import {LoadingService} from '../services/loading.service';
import {DeleteLesson, UpdateLesson} from '../store/lesson.actions';
import {DangerDialogComponent} from '../danger-dialog/danger-dialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {concatMap, filter, first, tap} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UpdateCourse} from '../store/course.actions';
import {defaultHtmlEditorConfig} from '../common/html-editor.config';
import {SaveDescription} from '../store/description.actions';
import {FileUploadService} from '../services/file-upload.service';
import {Observable} from 'rxjs/Observable';

import leftPad = require('left-pad');
import {EMPTY_IMG} from '../common/ui-constants';
import {UrlBuilderService} from '../services/url-builder.service';
import {UpdateStr} from '@ngrx/entity/src/models';
import {noop} from 'rxjs/util/noop';
import {AngularFireUploadTask} from 'angularfire2/storage/task';


@Component({
  selector: 'edit-lesson',
  templateUrl: './edit-lesson.component.html',
  styleUrls: ['./edit-lesson.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditLessonComponent implements OnInit, OnChanges {

  @Input() course: Course;
  @Input() lesson: Lesson;

  form: FormGroup;

  lessonDescription: string;
  toolbar = defaultHtmlEditorConfig;

  uploadTask: AngularFireUploadTask;

  percentageUpload$: Observable<number>;

  editDescriptionExpanded = false;

  descriptionOpenedOnce = false;

  constructor(private dialog: MatDialog,
              private store: Store<AppState>,
              private loading: LoadingService,
              private lessonsDB: LessonsDBService,
              private fb: FormBuilder,
              private upload: FileUploadService,
              private ub: UrlBuilderService) {

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(60)]],
      free: [false, [Validators.required]],

    });

  }

  ngOnInit() {


  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['lesson']) {
      this.form.patchValue(changes['lesson'].currentValue);
      this.lessonDescription = changes['lesson'].currentValue.description;
    }
  }

  isDraft() {
    return this.lesson && this.lesson.status === 'draft';

  }

  isReady() {
    return this.lesson && this.lesson.videoFileName;
  }

  isPublished() {
    return this.lesson && this.lesson.status === 'published';
  }

  isProcessing() {
    return this.lesson && this.lesson.status === 'processing';
  }

  isError() {
    return this.lesson && this.lesson.status === 'error';
  }

  saveLesson() {
    const lesson = {
      id: this.lesson.id,
      changes: {...this.form.value}
    };

    this.store.dispatch(new UpdateLesson({lesson, courseId: this.course.id}));

    const description = this.lessonDescription || '';

    this.store.dispatch(new SaveDescription({id: this.lesson.id, description}));

    this.loading.showLoading().subscribe();
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

      this.uploadTask = this.upload.uploadVideo(this.course.id, this.lesson.id, video);

      this.percentageUpload$ = this.uploadTask.percentageChanges();

      this.percentageUpload$
        .subscribe(
          noop,
          noop,
          () => {

            const update: UpdateStr<Lesson> = {
              id: this.lesson.id,
              changes: {
                status: 'processing'
              }
            };

            this.store.dispatch(new UpdateLesson({lesson: update, courseId: this.course.id}));

            this.onVideoUploadCompleted();
          }
        );

    }

  }

  onVideoUploadCompleted() {

    this.lessonsDB.suscribeToLesson(this.course.id, this.lesson.id)
      .pipe(
        filter(lesson => lesson.status !== 'processing'),
        first(),
        tap(lesson => this.dispatchLessonChanges(lesson))
      )
      .subscribe();

  }

  cancelUpload() {

    this.uploadTask.cancel();

    this.uploadTask = undefined;
    this.percentageUpload$ = undefined;

    this.dispatchLessonChanges({status: 'draft'});

  }

  videoThumbnailPath() {
    return this.ub.buildLessonThumbailUrl(this.course, this.lesson);
  }

  private dispatchLessonChanges(changes: Partial<Lesson>) {

    const update: UpdateStr<Lesson> = {
      id: this.lesson.id,
      changes
    };

    this.store.dispatch(new UpdateLesson({lesson: update, courseId: this.course.id}));

  }

  extractFileName(name: string) {

    if (!name) {
      return '';
    }

    const index = name.indexOf('-');

    return name.slice(index + 1);
  }


  durationInMinutes(duration: number) {

    if (!duration) {
      return '';
    }

    const minutes = Math.floor(duration / 60),
      seconds = duration % 60;

    return leftPad(minutes, 2, '0') + ':' + leftPad(seconds, 2, '0');

  }

  toggleEditLesson() {
    this.editDescriptionExpanded = !this.editDescriptionExpanded;
  }


}
