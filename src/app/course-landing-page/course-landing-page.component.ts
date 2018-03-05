import {Component, OnInit} from '@angular/core';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {TenantService} from '../services/tenant.service';
import {CoursesService} from '../services/courses.service';

@Component({
  selector: 'course-landing-page',
  templateUrl: './course-landing-page.component.html',
  styleUrls: ['./course-landing-page.component.scss']
})
export class CourseLandingPageComponent implements OnInit {

  course$: Observable<Course>;

  constructor(private route: ActivatedRoute,
              private tenant: TenantService,
              private coursesService: CoursesService) {

    this.course$ = this.coursesService.findCourseByUrl(route.snapshot.params['courseId']);

  }

  ngOnInit() {

  }

  imagesPath(course: Course) {
    return this.tenant.id + '/' + course.url + '/thumbnail';
  }


  onImageUploaded(course: Course, thumbnailUrl: string) {
    this.coursesService.updateCourse(course, {thumbnailUrl}).subscribe();
  }
}
