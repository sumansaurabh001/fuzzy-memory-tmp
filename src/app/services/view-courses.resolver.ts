import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {selectAllCourses, selectInitialCoursesLoaded} from '../store/selectors';
import {filter, first, map, tap, withLatestFrom} from 'rxjs/operators';
import {loadCourses} from '../store/course.actions';
import {CoursesDBService} from './courses-db.service';
import {LoadingService} from './loading.service';
import {Course} from '../models/course.model';


@Injectable()
export class ViewCoursesResolver implements Resolve<Course[]> {

  constructor(private store: Store<AppState>,
              private loading: LoadingService,
              private coursesDB: CoursesDBService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course[]>{
    return this.store
      .pipe(
        select(selectInitialCoursesLoaded),
        tap(initialCoursesLoaded => {

          if (!initialCoursesLoaded) {
            this.loading.showLoader(this.coursesDB.findAllCourses())
              .pipe(
                tap(courses => this.store.dispatch(loadCourses({courses})))
              )
              .subscribe();
          }
        }),
        filter(initialCoursesLoaded => initialCoursesLoaded),
        withLatestFrom(this.store.pipe(select(selectAllCourses))),
        map(([initialCoursesLoaded, courses]) => courses),
        first()
      );
  }



}
