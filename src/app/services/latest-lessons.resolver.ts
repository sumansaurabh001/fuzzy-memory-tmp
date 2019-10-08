import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {LatestLesson} from '../models/latest-lesson.model';
import {Observable} from 'rxjs/internal/Observable';
import {Injectable} from '@angular/core';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {LoadingService} from './loading.service';
import {selectLatestLessonsState} from '../store/latest-lessons.selectors';
import {filter, first, tap} from 'rxjs/operators';
import {loadNextLatestLessonsPage} from '../store/latest-lesson.actions';


@Injectable({
  providedIn: 'root'
})
export class LatestLessonsResolver implements Resolve<any> {

  constructor(private store: Store<AppState>) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.store
      .pipe(
        select(selectLatestLessonsState),
        tap(state => {
          if (state.lastPageLoaded == null) {
            this.store.dispatch(loadNextLatestLessonsPage());
          }
        }),
        filter(state => state.lastPageLoaded >= 0),
        first()
      );
  }

}
