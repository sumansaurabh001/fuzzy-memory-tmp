import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {EditCourse} from '../actions/course.actions';
import {catchError, first, map, tap} from 'rxjs/operators';
import {_throw} from 'rxjs/observable/throw';
import {Store} from '@ngrx/store';
import {CoursesDBService} from './courses-db.service';
import {State} from '../store';


@Injectable()
export class EditCourseGuard implements CanActivate {

  constructor(
    private coursesDB: CoursesDBService,
    private router: Router,
    private store: Store<State>) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  {
    return this.coursesDB
      .findCourseByUrl(route.params['courseUrl'])
      .pipe(
        tap( course => this.store.dispatch(new EditCourse({course}))),
        map(course => !!course),
        catchError(err => {
          this.router.navigateByUrl('/');
          return _throw(err);
        })
      );
  }




}
