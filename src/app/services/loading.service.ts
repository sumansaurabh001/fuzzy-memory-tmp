import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {catchError, filter, finalize, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {_throw} from 'rxjs/observable/throw';


@Injectable()
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  showLoader<T>(obs$: Observable<T>): Observable<T> {
    return of(null)
      .pipe(
        tap(() => this.loadingSubject.next(true)),
        switchMap(() => obs$),
        tap(() => this.loadingSubject.next(false)),
        catchError(err => {
          this.loadingSubject.next(false);
          return _throw(err);
        })
      );
  }


}
