import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {TenantService} from '../services/tenant.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessagesService} from '../services/messages.service';
import {concatMap, filter, first, last, tap} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {selectActiveCourse, selectActiveCourseDescription} from '../store/selectors';
import {CoursesDBService} from '../services/courses-db.service';
import {updateCourse} from '../store/course.actions';
import {addDescription, saveDescription} from '../store/description.actions';
import {defaultEditorConfig} from '../common/html-editor.config';
import {FileUploadService} from '../services/file-upload.service';
import {LoadingService} from '../services/loading.service';
import {generateId} from '../common/unique-id-generator';
import {UrlBuilderService} from '../services/url-builder.service';

@Component({
  selector: 'course-landing-page',
  templateUrl: './course-landing-page.component.html',
  styleUrls: ['./course-landing-page.component.scss'],
  providers: [MessagesService]
})
export class CourseLandingPageComponent implements OnInit {

  course$: Observable<Course>;
  courseDescription = '';

  form: FormGroup;

  editorConfig = defaultEditorConfig();

  imageProcessingOngoing = false;

  constructor(private route: ActivatedRoute,
              private tenant: TenantService,
              private store: Store<AppState>,
              private fb: FormBuilder,
              private messages: MessagesService,
              private coursesDB: CoursesDBService,
              private upload: FileUploadService,
              private loading: LoadingService,
              private ub: UrlBuilderService) {


    this.form = this.fb.group({
      title: ['', Validators.required],
      subTitle: [''],
      shortDescription: [''],
      downloadAllowed: [true, [Validators.required]]
    });

  }

  ngOnInit() {

    this.course$ = this.store.pipe(
      select(selectActiveCourse)
    );

    this.course$.subscribe(course => {
      if (course) {
        this.form.patchValue(course)
      }
    });

    this.store
      .pipe(
        select(selectActiveCourseDescription)
      )
      .subscribe(description => this.courseDescription = description);
  }

  courseThumbnailPath(course: Course) {
    return this.tenant.id + '/' + course.id + '/thumbnail';
  }

  save(courseId:string) {

    const description = this.courseDescription || '';

    const course = {
      id: courseId,
      changes: {...this.form.value}
    };

    this.store.dispatch(updateCourse({course}));

    this.store.dispatch(saveDescription({id: courseId, description}));

  }

  onCourseThumbnailSelected(course: Course, event) {

    const image = event.target.files[0];

    if (image) {
      this.loading.showLoaderUntilCompleted(this.upload.uploadFile(image, this.courseThumbnailPath(course)).percentageChanges())
        .pipe(
          tap(percent => {
            if (percent == 100) {
              this.imageProcessingOngoing = true;
              this.onThumbnailUploadCompleted(course);
            }
          })
        )
        .subscribe();
    }

  }

  onThumbnailUploadCompleted(course: Course) {

    const currentThumbnail = course.thumbnail;

    this.coursesDB.suscribeToCourse(course.id)
      .pipe(
        filter(course => course.thumbnail !== currentThumbnail),
        first(),
        tap(course => {

          if (course.thumbnail) {
            this.imageProcessingOngoing = false;
          }

          const update = {
            id: course.id,
            changes: {
              thumbnail: course.thumbnail
            }
          };

          this.store.dispatch(updateCourse({course: update}));

        })
      )
      .subscribe();
  }

  onLessonIconSelected(course: Course, event) {

    const icon = event.target.files[0];

    if (icon) {

      const uploadTask = this.upload.uploadFile(icon, this.courseThumbnailPath(course), true, true);

      const fullPath = uploadTask.task.snapshot.ref.fullPath;

      const uploadPercentage$ = uploadTask.percentageChanges();

      this.loading.showLoaderUntilCompleted(uploadPercentage$)
        .pipe(
          last(),
          concatMap(() => this.upload.getDownloadUrl(fullPath)),
          tap(lessonIconUrl => {

            const update = {
              id: course.id,
              changes: {
                lessonIconUrl
              }
            };

            this.store.dispatch(updateCourse({course: update}));

          })
        )
        .subscribe();
    }
  }

  thumbnailUrl(course: Course) {
    return this.ub.buildCourseThumbnailUrl(course);
  }


}







