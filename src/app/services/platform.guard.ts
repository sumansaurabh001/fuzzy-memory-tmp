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
import {SetBrandColors} from '../store/branding.actions';
import {DEFAULT_SCHOOL_ACCENT_COLOR, DEFAULT_SCHOOL_PRIMARY_COLOR} from '../common/ui-constants';

/*
*
*  This guard has a couple of very important functions, without which the website can't function:
*
*   - it determines the tenant at application startup time,
*      which will determine which courses and lessons will be shown to the user (as this is a multi-tenant app)
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

    debugger;

    return this.afAuth.authState
      .pipe(
        concatMap(auth => {

          // in the platform site, we always need the tenant to login in order to show the courses
          if (isPlatformSite && !auth) {
            this.router.navigate(['/login']);
            this.setPlatformBrandColors();
            return of(undefined);
          }
          // if the tenant is logged in to the platform site, get the tenantId from DB
          else if (isPlatformSite) {
            this.setPlatformBrandColors();
            return this.loading.showLoader(this.tenantDB.findTenantByUid());
          }
          // if its not the platform site, then it must be a subdomain or a custom domain - find the tenant
          else {

            // checking if this a tenant subdomain
            const subDomainRegex = /^(.*).onlinecoursehost/;

            const matches = hostname.match(subDomainRegex);

            if (matches.length == 2) {

              const subDomain = matches[1];

              return this.loading.showLoader(
                this.tenantDB.findTenantBySubdomain(subDomain)
                  .pipe(
                    tap(tenant => {
                      if (tenant) {
                        // theme the page using the tenant brand colors
                        this.store.dispatch(new SetBrandColors({primaryColor: tenant.primaryColor, accentColor: tenant.accentColor}));
                      }
                    })
                  )
              );

            }
            else {

              // TODO this is the custom domain case

            }

          }

        }),

        tap(tenant => {

          // this should not happen (it's just in case)
          if (!tenant) {
            this.router.navigate(['/login']);
            this.setPlatformBrandColors();
          }

          // setting the tenant id globally (determines what courses get loaded)
          this.tenant.id = tenant.id;

        }),
        map(tenant => !!tenant)
      );
  }

  setPlatformBrandColors() {
    this.store.dispatch(new SetBrandColors({primaryColor: DEFAULT_SCHOOL_PRIMARY_COLOR, accentColor: DEFAULT_SCHOOL_ACCENT_COLOR}));
  }


}
