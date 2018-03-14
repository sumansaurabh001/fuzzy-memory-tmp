import {Component, OnInit} from '@angular/core';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';
import {TenantService} from '../services/tenant.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessagesService} from '../services/messages.service';
import {UrlBuilderService} from '../services/url-builder.service';
import {filter, first, map, switchMap, tap} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {State} from '../store';
import {selectAllCourses, selectEditedCourse} from '../store/course.selectors';
import {CoursesDBService} from '../services/courses-db.service';
import {UpdateCourse} from '../store/course.actions';

@Component({
  selector: 'course-landing-page',
  templateUrl: './course-landing-page.component.html',
  styleUrls: ['./course-landing-page.component.scss'],
  providers: [MessagesService]
})
export class CourseLandingPageComponent implements OnInit {

  course$: Observable<Course>;
  courseDescription: string;

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

    this.course$ = this.store.pipe(select(selectEditedCourse));

    this.course$.subscribe(course => this.form.patchValue(course));


    // TODO load course description


  }

  imagesPath(course: Course) {
    return this.tenant.id + '/' + course.url + '/thumbnail';
  }

  thumbnailUrl(course: Course) {
    return this.ub.buildThumbailUrl(course);
  }

  save(course: Course) {

    const {title, subTitle, shortDescription} = this.form.value;

    const newDescription = this.courseDescription;

    /*

    TODO

    this.coursesStore.updateCourse(course, {title, subTitle, shortDescription})
      .pipe(
        switchMap(() => this.coursesStore.saveCourseDescription(course, newDescription))
      )
      .subscribe(
        () => {},
        err => this.messages.error('Could not save course.', err)
      );
      */
  }

  onThumbnailUploadCompleted(course: Course) {

    const currentThumbnail = course.thumbnail;

    this.coursesDB.suscribeToCourse(course.id)
      .pipe(
        filter(course => course.thumbnail !== currentThumbnail),
        first(),
        tap(course => {

          const update = {
            id:course.id,
            changes: {
              thumbnail: course.thumbnail
            }
          }

          this.store.dispatch(new UpdateCourse({course: update}));

        })
      )
      .subscribe();
  }

}







