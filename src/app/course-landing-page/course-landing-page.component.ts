import {Component, OnInit} from '@angular/core';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';
import {TenantService} from '../services/tenant.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessagesService} from '../services/messages.service';
import {UrlBuilderService} from '../services/url-builder.service';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {State} from '../store';
import {selectAllCourses} from '../store/course.selectors';

@Component({
  selector: 'course-landing-page',
  templateUrl: './course-landing-page.component.html',
  styleUrls: ['./course-landing-page.component.scss'],
  providers: [MessagesService]
})
export class CourseLandingPageComponent implements OnInit {

  course$: Observable<Course>;
  courseDescription : string;

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
              private ub: UrlBuilderService) {


    this.form = this.fb.group({
      title: ['', Validators.required],
      subTitle: ['', Validators.required],
      shortDescription: ['', Validators.required]
    });

  }

  ngOnInit() {

    const courseUrl = this.route.snapshot.params['courseUrl'];

    this.course$ = this.store
      .pipe(
        select(selectAllCourses),
        map(courses => courses.find(course => course.url == courseUrl)),
        filter(course => !!course)
      );

    this.course$.subscribe(course => this.form.patchValue(course));


    /*

    TODO

    this.course$.pipe(
      switchMap(course => this.coursesStore.selectCourseDescription(course)),
      tap(desc => this.courseDescription = desc)
    )
    .subscribe();


    */

  }

  imagesPath(course: Course) {
    return this.tenant.id + '/' + course.url + '/thumbnail';
  }

  thumbnailUrl(course:Course) {
    return this.ub.buildThumbailUrl(course);
  }

  save(course:Course) {

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

  onThumbnailUploadCompleted(course:Course) {
    //TODO this.coursesStore.syncNewCourseThumbnail(course);
  }

}
