import {Injectable} from '@angular/core';
import {CoursesService} from './courses.service';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {catchError} from 'rxjs/operators';
import {_throw} from 'rxjs/observable/throw';


@Injectable()
export class CourseResolver implements Resolve<Course> {

  constructor(private coursesService: CoursesService, private router: Router) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course> {
    return this.coursesService
      .loadCourseWithUrl(route.params['courseUrl'])
      .pipe(
        catchError(err => {
          this.router.navigateByUrl('/');
          return _throw(err);
        })
      );

  }


}
