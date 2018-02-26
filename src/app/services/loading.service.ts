import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {filter, finalize, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';
import {NavigationEnd, NavigationStart, Router, RoutesRecognized} from '@angular/router';




@Injectable()
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor(private router:Router) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart || event instanceof NavigationEnd),
        map(event => event instanceof NavigationStart)
      )
      .subscribe(switchingRoutes => this.loadingSubject.next(switchingRoutes));
  }

  showLoaderWhileBusy<T>(obs$:Observable<T>) : Observable<T> {
    return of(null)
      .pipe(
          tap(() => this.loadingSubject.next(true)),
          switchMap(() => obs$),
          finalize(() => this.loadingSubject.next(false)),
      );
  }

}
