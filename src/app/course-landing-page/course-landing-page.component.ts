import {Component, OnInit} from '@angular/core';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';
import {TenantService} from '../services/tenant.service';
import {CoursesService} from '../services/courses.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessagesService} from '../services/messages.service';
import {UrlBuilderService} from '../services/url-builder.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'course-landing-page',
  templateUrl: './course-landing-page.component.html',
  styleUrls: ['./course-landing-page.component.scss'],
  providers: [MessagesService]
})
export class CourseLandingPageComponent implements OnInit {

  course$: Observable<Course>;
  longDescription$ : Observable<string>;

  form: FormGroup;

  constructor(private route: ActivatedRoute,
              private tenant: TenantService,
              private coursesService: CoursesService,
              private fb: FormBuilder,
              private messages: MessagesService,
              private ub: UrlBuilderService) {


    this.form = this.fb.group({
      title: ['', Validators.required],
      subTitle: ['', Validators.required],
      shortDescription: ['', Validators.required],
      longDescription: ['', []]
    });

  }

  ngOnInit() {

    const courseUrl = this.route.snapshot.params['courseUrl'];

    this.course$ = this.coursesService.selectCourseByUrl(courseUrl);

    this.course$.subscribe(course => this.form.patchValue(course));

    this.longDescription$ = this.course$.pipe(
      switchMap(course => this.coursesService.selectCourseDescription(course))
    );

  }

  imagesPath(course: Course) {
    return this.tenant.id + '/' + course.url + '/thumbnail';
  }

  thumbnailUrl(course:Course) {
    return this.ub.buildThumbailUrl(course);
  }

  save(course:Course) {

    const {title, subTitle, shortDescription, longDescription} = this.form.value;

    this.coursesService.updateCourse(course, {title, subTitle, shortDescription})
      .pipe(
        switchMap(() => this.coursesService.saveCourseDescription(course, longDescription))
      )
      .subscribe(
        () => {},
        err => this.messages.error('Could not save course.', err)
      );
  }

  onThumbnailUploadCompleted(course:Course) {
    this.coursesService.syncNewCourseThumbnail(course);
  }

}
