import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Resolve, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {Observable} from 'rxjs';
import {GetSubscriptionContent} from '../store/content.actions';
import {LoadingService} from './loading.service';
import {SubscriptionContent} from '../models/content/subscription-content.model';
import {createContentResolver} from './create-content-resolver';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionContentResolver implements Resolve<SubscriptionContent> {


  constructor(
    private store:Store<AppState>,
    private loading: LoadingService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

    const loadContent$ = createContentResolver(this.store, "subscription", GetSubscriptionContent);

    return this.loading.showLoaderUntilCompleted(loadContent$);
  }


}
