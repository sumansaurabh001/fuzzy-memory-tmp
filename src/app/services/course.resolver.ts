import { Injectable } from '@angular/core';
import {Course} from '../../model/course.model';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {CoursesService} from './courses.service';
import {catchError, tap} from 'rxjs/operators';
import {_throw} from 'rxjs/observable/throw';



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
