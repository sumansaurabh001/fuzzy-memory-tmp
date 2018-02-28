import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import { tap} from 'rxjs/operators';
import {Course} from '../models/course.model';
import {CoursesService} from './courses.service';



@Injectable()
export class CourseResolver implements Resolve<Course> {

  constructor(
    private coursesService: CoursesService,
    private router: Router) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course> {

    const courseUrl = route.paramMap.get('id');

    return this.coursesService.findCourseByUrl(courseUrl)
      .pipe(
        tap(course => {
          if (!course) {
            console.log("Could not find course with url, redirecting to home page:", courseUrl);
            this.router.navigateByUrl('/');
          }
        })
      );
  }


}
