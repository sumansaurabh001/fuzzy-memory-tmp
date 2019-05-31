import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {TenantsDBService} from '../services/tenants-db.service';
import {checkIfSingleSignOnPage, DEFAULT_THEME} from '../common/platform-utils';
import {ThemeChanged} from '../store/platform.actions';
import {first, map, tap} from 'rxjs/operators';
import {AppState} from '../store';
import {Store} from '@ngrx/store';

/**
 *
 * This guard is only applied to the login page. This will apply the tenant brand to the login page in case
 * we are using the single sign-on login page login.onlinecoursehost.com.
 *
 * It's important to load the brand settings before displaying the login page, otherwise the page will look broken for a second.
 *
 * In the case of a login to the platform website, this guard will not do anything because the platform brand is already applied.
 *
 */

@Injectable()
export class LoginGuard implements CanActivate {

  tenantId:string;

  constructor(
    private tenantsDB: TenantsDBService,
    private store: Store<AppState>
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    this.tenantId = route.queryParamMap.get('tenantId');

    if (!checkIfSingleSignOnPage()) {
      return of(true);
    }
    else {

      return this.tenantsDB.findTenantById(this.tenantId)
        .pipe(
          tap(tenant => {

            if (tenant) {
              this.store.dispatch(new ThemeChanged(tenant.brandTheme));
            }
            else {
              this.store.dispatch(new ThemeChanged(DEFAULT_THEME));
            }

          }),
            map(tenant => !!tenant),
            first()
        );
    }

  }

}
