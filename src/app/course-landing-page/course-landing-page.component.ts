import {Component, OnInit} from '@angular/core';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {TenantService} from '../services/tenant.service';

@Component({
  selector: 'course-landing-page',
  templateUrl: './course-landing-page.component.html',
  styleUrls: ['./course-landing-page.component.scss']
})
export class CourseLandingPageComponent implements OnInit {

  course$: Observable<Course>;

  constructor(private route: ActivatedRoute,
              private tenant: TenantService) {

    this.course$ = route.data.pipe(map(data => data['course']));

  }

  ngOnInit() {

  }

  imagesPath(course: Course) {
    return this.tenant.id + '/' + course.url + '/thumbnail';
  }


}
