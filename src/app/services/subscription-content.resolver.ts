import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Resolve, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {Observable} from 'rxjs';
import {isSubscriptionContentLoaded, selectContentState, selectSubscriptionContent} from '../store/content.selectors';
import {filter, first, tap} from 'rxjs/operators';
import {GetSubscriptionContent} from '../store/content.actions';
import {LoadingService} from './loading.service';
import {SubscriptionContent} from '../models/content/subscription-content.model';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionContentResolver implements Resolve<SubscriptionContent> {


  constructor(
    private store:Store<AppState>,
    private loading: LoadingService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const loadSubscriptionContent$ = this.store
      .pipe(
        select(selectContentState),
        tap(state => {
          if (!state.subscription.loaded) {
            this.store.dispatch(new GetSubscriptionContent());
          }
        }),
        filter(state => state.subscription.loaded),
        first()
      );

    return this.loading.showLoaderUntilCompleted(loadSubscriptionContent$);
  }


}
