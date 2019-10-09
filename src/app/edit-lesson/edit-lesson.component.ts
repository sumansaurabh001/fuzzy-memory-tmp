import {ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Lesson} from '../models/lesson.model';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {LessonsDBService} from '../services/lessons-db.service';
import {Course} from '../models/course.model';
import {LoadingService} from '../services/loading.service';
import {deleteLesson, publishLesson, unpublishLesson, updateLesson, uploadFinished, uploadStarted} from '../store/lesson.actions';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {concatMap, filter, finalize, first, map, tap} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {defaultEditorConfig} from '../common/html-editor.config';
import {loadDescription, saveDescription} from '../store/description.actions';
import {FileUploadService} from '../services/file-upload.service';
import {Observable, noop} from 'rxjs';
import {UpdateStr} from '@ngrx/entity/src/models';
import {AngularFireUploadTask} from '@angular/fire/storage/task';
import {selectDescriptionsState} from '../store/selectors';
import {UrlBuilderService} from '../services/url-builder.service';


@Component({
  selector: 'edit-lesson',
  templateUrl: './edit-lesson.component.html',
  styleUrls: ['./edit-lesson.component.scss']
})
export class EditLessonComponent implements OnInit, OnChanges {

  @Input() course: Course;
  @Input() lesson: Lesson;

  form: FormGroup;

  lessonDescription: string;
  modules = defaultEditorConfig;

  uploadTask: AngularFireUploadTask;

  percentageUpload$: Observable<number>;

  descriptionOpenedOnce = false;

  constructor(private dialog: MatDialog,
              private store: Store<AppState>,
              private loading: LoadingService,
              private lessonsDB: LessonsDBService,
              private fb: FormBuilder,
              private upload: FileUploadService,
              private ub: UrlBuilderService) {


    this.form = this.fb.group({
      title: ['', [Validators.maxLength(60)]],
      free: [false, [Validators.required]],

    });

  }

  ngOnInit() {

    this.store.pipe(
      select(selectDescriptionsState),
      map(descriptions => descriptions[this.lesson.id]),
      tap(description => this.lessonDescription = description)
    )
    .subscribe();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['lesson']) {
      this.form.patchValue(changes['lesson'].currentValue);
    }
  }

  isDraft() {
    return this.lesson && this.lesson.status === 'draft';

  }

  isReadyToPublish() {
    return this.lesson && this.lesson.status == 'draft' && this.lesson.uploadStatus === 'done';
  }

  isPublished() {
    return this.lesson && this.lesson.status === 'published';
  }

  isProcessing() {
    return this.lesson && this.lesson.uploadStatus === 'processing';
  }

  isError() {
    return this.lesson && this.lesson.uploadStatus === 'error';
  }

  isUploadNeeded(lesson: Lesson) {
    return lesson.status == 'draft' && lesson.uploadStatus != "done";

  }

  saveLesson() {
    const lesson = {
      id: this.lesson.id,
      changes: {...this.form.value}
    };

    this.store.dispatch(updateLesson({lesson, courseId: this.course.id}));

    const description = this.lessonDescription || '';

    this.store.dispatch(saveDescription({id: this.lesson.id, description}));

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
        filter(result => result && result.confirm),
        concatMap(() => this.loading.showLoader(this.lessonsDB.deleteLesson(this.course.id, this.lesson.id, this.lesson.videoDuration))),
        tap(() => this.store.dispatch(deleteLesson({id: this.lesson.id})))
      )
      .subscribe();

  }

  onFileSelected(event) {

    const video = event.target.files[0],
          fileName = video.name;

    if (video) {

      this.uploadTask = this.upload.uploadVideo(this.course.id, this.lesson.id, video);

      this.percentageUpload$ = this.uploadTask.percentageChanges();

      this.store.dispatch(uploadStarted({fileName}));

      this.percentageUpload$.
        pipe(
          finalize(() => this.store.dispatch(uploadFinished({fileName})))
        )
        .subscribe(
          noop,
          noop,
          () => {

            const update: UpdateStr<Lesson> = {
              id: this.lesson.id,
              changes: {
                uploadStatus: 'processing'
              }
            };

            this.store.dispatch(updateLesson({lesson: update, courseId: this.course.id}));

            this.onVideoUploadCompleted();
          }
        );

    }

  }

  onVideoUploadCompleted() {

    this.percentageUpload$ = undefined;

    this.lessonsDB.suscribeToLesson(this.course.id, this.lesson.id)
      .pipe(
        filter(lesson => lesson.uploadStatus == 'done'),
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

  private dispatchLessonChanges(changes: Partial<Lesson>) {

    const update: UpdateStr<Lesson> = {
      id: this.lesson.id,
      changes
    };

    this.store.dispatch(updateLesson({lesson: update, courseId: this.course.id}));

  }

  toggleEditLesson() {
    if (!this.descriptionOpenedOnce) {
      this.descriptionOpenedOnce = true;
      this.store.dispatch(loadDescription({descriptionId: this.lesson.id}));
    }
  }


  publish() {
    this.store.dispatch(publishLesson({courseId: this.course.id, lessonId: this.lesson.id}));
  }

  unpublish() {
    this.store.dispatch(unpublishLesson({courseId: this.course.id, lessonId: this.lesson.id}));
  }

  videoThumbnailPath() {
    return this.ub.buildLessonThumbailUrl(this.course, this.lesson);
  }

}
