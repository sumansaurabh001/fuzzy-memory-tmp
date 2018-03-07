import {Component, OnInit} from '@angular/core';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {map, tap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {TenantService} from '../services/tenant.service';
import {CoursesService} from '../services/courses.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessagesService} from '../services/messages.service';

@Component({
  selector: 'course-landing-page',
  templateUrl: './course-landing-page.component.html',
  styleUrls: ['./course-landing-page.component.scss']
})
export class CourseLandingPageComponent implements OnInit {

  course$: Observable<Course>;

  form: FormGroup;

  constructor(private route: ActivatedRoute,
              private tenant: TenantService,
              private coursesService: CoursesService,
              private fb: FormBuilder,
              private messages: MessagesService) {

    this.course$ = this.coursesService.selectCourseByUrl(this.route.snapshot.params['courseUrl']);

    this.course$
      .subscribe(course => {
        this.form = this.fb.group({
          title: [course.title, Validators.required],
          subTitle: [course.subTitle, Validators.required],
          shortDescription: [course.shortDescription, Validators.required]
        });
      });


  }

  ngOnInit() {

  }

  imagesPath(course: Course) {
    return this.tenant.id + '/' + course.url + '/thumbnail';
  }

  save(course:Course) {
    this.coursesService.updateCourse(course, this.form.value)
      .subscribe(
        () => this.messages.info("Course Saved Successfully."),
        err => this.messages.error('Could not save course.', err)
      );
  }

}
