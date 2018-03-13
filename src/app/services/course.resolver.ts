import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {catchError, tap} from 'rxjs/operators';
import {_throw} from 'rxjs/observable/throw';
import {CoursesDBService} from './courses-db.service';
import {Store} from '@ngrx/store';
import {State} from '../store';
import {AddCourse} from '../actions/course.actions';



@Injectable()
export class CourseResolver implements Resolve<Course> {

  constructor(private coursesDB: CoursesDBService, private router: Router, private store: Store<State>) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course> {
    return this.coursesDB
      .findCourseByUrl(route.params['courseUrl'])
      .pipe(
        tap(course => this.store.dispatch(new AddCourse({course}))),
        catchError(err => {
          this.router.navigateByUrl('/');
          return _throw(err);
        })
      );

  }


}
