import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {TenantService} from '../services/tenant.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessagesService} from '../services/messages.service';
import {UrlBuilderService} from '../services/url-builder.service';
import {filter, first, tap} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {selectActiveCourse, selectActiveCourseDescription} from '../store/selectors';
import {CoursesDBService} from '../services/courses-db.service';
import { UpdateCourse} from '../store/course.actions';
import {AddDescription, SaveDescription} from '../store/description.actions';
import {defaultEditorConfig} from '../common/html-editor.config';
import {FileUploadService} from '../services/file-upload.service';
import {LoadingService} from '../services/loading.service';

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

  editorConfig = defaultEditorConfig;

  imageProcessingOngoing = false;

  constructor(private route: ActivatedRoute,
              private tenant: TenantService,
              private store: Store<AppState>,
              private fb: FormBuilder,
              private messages: MessagesService,
              private ub: UrlBuilderService,
              private coursesDB: CoursesDBService,
              private upload: FileUploadService,
              private loading: LoadingService) {


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

  imagesPath(course: Course) {
    return this.tenant.id + '/' + course.id + '/thumbnail';
  }

  thumbnailUrl(course: Course) {
    return this.ub.buildCourseThumbailUrl(course);
  }

  save(courseId:string) {

    const description = this.courseDescription || '';

    const course = {
      id: courseId,
      changes: {...this.form.value}
    };

    this.store.dispatch(new UpdateCourse({course}));

    this.store.dispatch(new SaveDescription({id: courseId, description}));

  }

  onFileSelected(course: Course, event) {

    const image = event.target.files[0];

    if (image) {
      this.loading.showLoaderUntilCompleted(this.upload.uploadFile(image, this.imagesPath(course)).percentageChanges())
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

          this.store.dispatch(new UpdateCourse({course: update}));

        })
      )
      .subscribe();
  }

}







