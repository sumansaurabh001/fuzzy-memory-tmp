import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {State} from '../store';
import {selectAllCourses} from '../store/course.selectors';
import {filter, first, map, tap} from 'rxjs/operators';
import {LoadCourseSummaries} from '../store/course.actions';



@Injectable()
export class ViewCoursesGuard implements CanActivate {

  constructor(private store: Store<State>) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  {
    return this.store
      .pipe(
        select(selectAllCourses),
        tap(courses => {
          if (courses.length == 0) {
            this.store.dispatch(new LoadCourseSummaries());
          }
        }),
        map(courses => !!courses),
        first()
      );
  }


}
