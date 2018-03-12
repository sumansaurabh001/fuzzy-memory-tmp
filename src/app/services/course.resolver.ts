import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {catchError, tap} from 'rxjs/operators';
import {_throw} from 'rxjs/observable/throw';
import {CoursesStore} from './courses.store';


@Injectable()
export class CourseResolver implements Resolve<Course> {

  constructor(private coursesStore: CoursesStore, private router: Router) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course> {
    return this.coursesStore
      .loadCourseWithUrl(route.params['courseUrl'])
      .pipe(
        catchError(err => {
          this.router.navigateByUrl('/');
          return _throw(err);
        })
      );

  }


}
