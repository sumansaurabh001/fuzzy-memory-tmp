import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject, of, throwError as _throw} from 'rxjs';
import {catchError, delay, filter, finalize, map, switchMap, tap} from 'rxjs/operators';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';



@Injectable()
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  showLoader<T>(obs$: Observable<T>): Observable<T> {

    debugger;

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

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {

    debugger;

    return of(null)
      .pipe(
        tap(() => this.loadingSubject.next(true)),
        switchMap(() => obs$),
        finalize(() => {
          this.loadingSubject.next(false);
        })
      );
  }


  /*
  *
  * useful for giving the user some visual feedback, in situations where the operation is either too fast or is being performed in the background
  *
  * */

  showLoading(delayMs = 300) {
    return this.showLoader(of(null).pipe(delay(delayMs)));
  }


  loadingOn() {
    this.loadingSubject.next(true);
  }

  loadingOff() {
    this.loadingSubject.next(false);
  }


}
