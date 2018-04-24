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
import {
  DEFAULT_SCHOOL_ACCENT_COLOR, DEFAULT_SCHOOL_PRIMARY_COLOR, PLATFORM_ACCENT_COLOR,
  PLATFORM_PRIMARY_COLOR
} from '../common/ui-constants';
import {checkIfPlatformSite, getPlatformSubdomain} from '../common/platform-utils';

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


  constructor(private tenant: TenantService,
              private tenantDB: TenantsDBService,
              private afAuth: AngularFireAuth,
              private store: Store<AppState>,
              private router: Router,
              private loading: LoadingService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    const isPlatformSite = checkIfPlatformSite(),
      subDomain = getPlatformSubdomain();

    return this.afAuth.authState
      .pipe(

        // get the tenant Id and brand styles
        concatMap(auth => {

          // platform site main app, logged out
          if (isPlatformSite && !auth) {
            this.router.navigate(['/login']);
            this.setPlatformBrandColors();
            return of(undefined);
          }

          // platform site main app, logged in
          else if (isPlatformSite) {
            this.setPlatformBrandColors();
            return this.loading.showLoader(this.tenantDB.findTenantByUid());
          }

          // platform site subdomain
          else if (subDomain) {
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

          //TODO custom domain case
          else {

          }


        }),

        tap(tenant => {

          if (!tenant) {
            return;
          }

          // setting the tenant id globally (determines what courses get loaded)
          this.tenant.id = tenant.id;

        }),
        map(tenant => !!tenant)
      );
  }

  setPlatformBrandColors() {
    this.store.dispatch(new SetBrandColors({primaryColor: PLATFORM_PRIMARY_COLOR, accentColor: PLATFORM_ACCENT_COLOR}));
  }


}
