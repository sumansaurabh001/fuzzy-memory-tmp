import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {TenantService} from './tenant.service';
import {Injectable} from '@angular/core';
import {of} from 'rxjs/observable/of';
import {AngularFireAuth} from 'angularfire2/auth';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {concatMap, filter, map, tap, withLatestFrom} from 'rxjs/operators';
import {isLoggedIn} from '../store/selectors';
import {TenantsDBService} from './tenants-db.service';
import {LoadingService} from './loading.service';

/*
*
*  This guard has a couple of functions:
*
*   - it determines the tenant at application startup time,
*      which will determine which courses and lessons will be shown to the user.
*
*   - it loads the tenant branding styles
*
* */


@Injectable()
export class PlatformGuard implements CanActivate {


  constructor(
    private tenant: TenantService,
    private tenantDB: TenantsDBService,
    private afAuth: AngularFireAuth,
    private store: Store<AppState>,
    private router: Router,
    private loading: LoadingService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  {

    const hostname = document.location.hostname;

    const isPlatformSite = hostname.includes('app.onlinecoursehost');

    return this.afAuth.authState
      .pipe(
        concatMap(auth => {

          // in the platform site, we always need the tenant to login in order to show the courses
          if (isPlatformSite && !auth) {
            this.router.navigate(['/login']);
            return of(undefined);
          }
          // if the tenant is logged in to the platform site, get the tenantId
          else if (isPlatformSite) {
            return this.loading.showLoader(this.tenantDB.findTenantByUid());
          }
          else {

            // checking if this a tenant subdomain
            const subDomainRegex = /^(.*).onlinecoursehost/;

            const matches = hostname.match(subDomainRegex);

            if (matches.length == 2) {

              const subDomain = matches[1];

              return this.loading.showLoader(this.tenantDB.findTenantBySubdomain(subDomain));

            }
            else {

              // TODO this is the custom domain case

            }

          }

        }),
        // setting the tenant id is necessary before showing any courses
        tap(tenant => {
          if (tenant) {
            this.tenant.id = tenant.id;
          }
          else {
            this.router.navigate(['/login']);
          }
        }),
        map(tenant => !!tenant)
      );
  }

}
