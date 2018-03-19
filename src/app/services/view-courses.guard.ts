import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {State} from '../store';
import {selectAllCourses, selectInitialCoursesLoaded} from '../store/selectors';
import {filter, first, map, tap} from 'rxjs/operators';
import {LoadCourses} from '../store/course.actions';
import {CoursesDBService} from './courses-db.service';
import {LoadingService} from './loading.service';


@Injectable()
export class ViewCoursesGuard implements CanActivate {

  constructor(private store: Store<State>,
              private loading: LoadingService,
              private coursesDB: CoursesDBService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store
      .pipe(
        select(selectInitialCoursesLoaded),
        tap(initialCoursesLoaded => {

          if (!initialCoursesLoaded) {
            this.loading.showLoader(this.coursesDB.findAllCourses())
              .pipe(
                tap(courses => this.store.dispatch(new LoadCourses({courses})))
              )
              .subscribe();
          }
        }),
        filter(initialCoursesLoaded => initialCoursesLoaded),
        first()
      );
  }


}
