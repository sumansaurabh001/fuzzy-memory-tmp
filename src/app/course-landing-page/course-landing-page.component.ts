import {Component, OnInit} from '@angular/core';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';
import {TenantService} from '../services/tenant.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessagesService} from '../services/messages.service';
import {UrlBuilderService} from '../services/url-builder.service';
import {filter, first, tap} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {State} from '../store';
import { selectEditedCourseSummary, selectEditedCourseDescription} from '../store/selectors';
import {CoursesDBService} from '../services/courses-db.service';
import { UpdateCourse} from '../store/course.actions';
import {AddDescription, SaveDescription} from '../store/description.actions';

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

  toolbar = [
    ['bold', 'italic', 'underline', 'strikeThrough'],
    ['justifyCenter'],
    ['paragraph', 'blockquote', 'removeBlockquote', 'horizontalLine', 'orderedList', 'unorderedList'],
    ['link'],
    ['code']
  ];

  constructor(private route: ActivatedRoute,
              private tenant: TenantService,
              private store: Store<State>,
              private fb: FormBuilder,
              private messages: MessagesService,
              private ub: UrlBuilderService,
              private coursesDB: CoursesDBService) {


    this.form = this.fb.group({
      title: ['', Validators.required],
      subTitle: ['', Validators.required],
      shortDescription: ['', Validators.required]
    });

  }

  ngOnInit() {

    this.course$ = this.store.pipe(
      select(selectEditedCourseSummary)
    );

    this.course$.subscribe(course => {
      if (course) {
        this.form.patchValue(course)
      }
    });

    this.store
      .pipe(
        select(selectEditedCourseDescription)
      )
      .subscribe(descr => this.courseDescription = descr);

  }

  imagesPath(course: Course) {
    return this.tenant.id + '/' + course.id + '/thumbnail';
  }

  thumbnailUrl(course: Course) {
    return this.ub.buildThumbailUrl(course);
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

  onThumbnailUploadCompleted(course: Course) {

    const currentThumbnail = course.thumbnail;

    this.coursesDB.suscribeToCourse(course.id)
      .pipe(
        filter(course => course.thumbnail !== currentThumbnail),
        first(),
        tap(course => {

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







