import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {LoadCourseDetail} from '../actions/course.actions';
import {filter, first, map, tap} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {CoursesDBService} from './courses-db.service';
import {State} from '../store';
import {selectAllCourses} from '../store/course.selectors';
import {of} from 'rxjs/observable/of';


@Injectable()
export class EditCourseGuard implements CanActivate {

  constructor(private coursesDB: CoursesDBService,
              private router: Router,
              private store: Store<State>) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    const courseUrl = route.paramMap.get('courseUrl');

     return this.store
      .pipe(
        select(selectAllCourses),
        tap(courses => {

          const course = courses.find(course => course.url === courseUrl);

          if (!course) {
            this.store.dispatch(new LoadCourseDetail({courseUrl}));
          }

        }),
        map(course => !!course),
        first()
      );
  }

}
