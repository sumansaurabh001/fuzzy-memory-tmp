import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {finalize, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';




@Injectable()
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {


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
