import {ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Lesson} from '../models/lesson.model';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {LessonsDBService} from '../services/lessons-db.service';
import {Course} from '../models/course.model';
import {LoadingService} from '../services/loading.service';
import {DeleteLesson, UpdateLesson, UploadFinished, UploadStarted} from '../store/lesson.actions';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {concatMap, filter, finalize, first, map, tap} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UpdateCourse} from '../store/course.actions';
import {defaultEditorConfig} from '../common/html-editor.config';
import {LoadDescription, SaveDescription} from '../store/description.actions';
import {FileUploadService} from '../services/file-upload.service';
import {Observable, noop} from 'rxjs';
import {UrlBuilderService} from '../services/url-builder.service';
import {UpdateStr} from '@ngrx/entity/src/models';
import {AngularFireUploadTask} from '@angular/fire/storage/task';
import {selectDescriptionsState} from '../store/selectors';


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

  isReady() {
    return this.lesson && this.lesson.originalFileName;
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

    const deleteLesson$ = this.lessonsDB.deleteLesson(this.course.id, this.lesson.id, this.lesson.videoDuration);

    dialogRef.afterClosed()
      .pipe(
        filter(result => result.confirm),
        concatMap(() => this.loading.showLoader(deleteLesson$)),
        tap(() => this.store.dispatch(new DeleteLesson({id: this.lesson.id})))
      )
      .subscribe();

  }

  onFileSelected(event) {

    const video = event.target.files[0],
          fileName = video.name;

    if (video) {

      this.uploadTask = this.upload.uploadVideo(this.course.id, this.lesson.id, video);

      this.percentageUpload$ = this.uploadTask.percentageChanges();

      this.store.dispatch(new UploadStarted({fileName}));

      this.percentageUpload$.
        pipe(
          finalize(() => this.store.dispatch(new UploadFinished({fileName})))
        )
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

    this.percentageUpload$ = undefined;

    this.lessonsDB.suscribeToLesson(this.course.id, this.lesson.id)
      .pipe(
        tap(console.log),
        filter(lesson => lesson.status == 'ready'),
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

  toggleEditLesson() {
    if (!this.descriptionOpenedOnce) {
      this.descriptionOpenedOnce = true;
      this.store.dispatch(new LoadDescription(this.lesson.id));
    }
  }


}
