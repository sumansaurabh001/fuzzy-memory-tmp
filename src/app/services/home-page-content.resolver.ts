import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Resolve, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {Observable} from 'rxjs';
import {getHomePageContent} from '../store/content.actions';
import {LoadingService} from './loading.service';
import {SubscriptionContent} from '../models/content/subscription-content.model';
import {createContentResolver} from './create-content-resolver';
import {HomePageContent} from '../models/content/home-page-content.model';


@Injectable({
  providedIn: 'root'
})
export class HomePageContentResolver implements Resolve<HomePageContent> {


  constructor(
    private store:Store<AppState>,
    private loading: LoadingService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

    const loadContent$ = createContentResolver(this.store, "homePage", getHomePageContent);

    return this.loading.showLoaderUntilCompleted(loadContent$);
  }


}
