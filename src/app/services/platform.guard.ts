import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {TenantService} from './tenant.service';
import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {concatMap, filter, map, tap, withLatestFrom} from 'rxjs/operators';
import {TenantsDBService} from './tenants-db.service';
import {LoadingService} from './loading.service';
import {checkIfPlatformSite, getPlatformSubdomain, DEFAULT_THEME} from '../common/platform-utils';
import {setTenantInfo, themeChanged} from '../store/platform.actions';
import {Tenant, TenantInfo} from '../models/tenant.model';
import {CookieService} from 'ngx-cookie-service';
import {pricingPlansLoaded} from '../store/pricing-plans.actions';


/*
*
*
*  This guard has a couple of very important functions, without which the website cannot function:
*
*   - it determines the tenant at application startup time, which will determine which courses
*     and lessons will be shown to the user (as this is a multi-tenant app)
*
*   - it loads the tenant branding styles, without which we cannot even display the website correctly to the user
*
*
* */


@Injectable()
export class PlatformGuard implements CanActivate {

  constructor(private tenant: TenantService,
              private tenantDB: TenantsDBService,
              private afAuth: AngularFireAuth,
              private store: Store<AppState>,
              private router: Router,
              private loading: LoadingService,
              private cookies: CookieService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

      // login the user using a url JWT parameter, if it arrived via a redirect from the single sign-on login page
      const authJwtToken = route.queryParamMap.get('authJwtToken');

      if (authJwtToken) {

        this.afAuth.auth.signInWithCustomToken(authJwtToken)
          .then(() => {
            // clear the JWT from the url, to make sure the sign in is only done once
            window.history.replaceState(null, null, window.location.pathname);
          });
      }

     // the tenant is only going to be determined once, at application startup time
     if (this.tenant.id) {
       return of(true);
     }

     return this.determinePlatformSettings();
  }

  determinePlatformSettings(): Observable<boolean> {

    const isPlatformSite = checkIfPlatformSite(),
      subDomain = getPlatformSubdomain();

    return this.afAuth.authState
      .pipe(

        // get the tenant
        concatMap(auth => {

          // platform site main app, logged out: no tenant
          if (isPlatformSite && !auth) {
            this.router.navigate(['/login']);
            return of(undefined);
          }

          // platform site main app, logged in
          else if (isPlatformSite) {
            return this.loading.showLoader(this.tenantDB.findTenantByCurrentUid());
          }

          // platform site subdomain
          else if (subDomain) {
            return this.loading.showLoader(this.tenantDB.findTenantBySubdomain(subDomain));
          }

          //TODO custom domain case
          else {

            return of(undefined);

          }

        }),

        tap(tenant => {

          this.saveTenantDetails(tenant);

          // setting the tenant id globally (determines what courses get loaded)
          if (tenant) {
            this.tenant.id = tenant.id;
          }

        }),

        map(tenant => !!tenant)
      );

  }


  saveTenantDetails(tenant: Tenant) {

    const tenantInfo: TenantInfo = {
      schoolName: tenant.schoolName,
      subDomain: tenant.subDomain,
      supportEmail: tenant.supportEmail
    };

    this.store.dispatch(setTenantInfo({tenantInfo}));

    if (tenant.pricingPlans) {
      this.store.dispatch(pricingPlansLoaded({pricingPlans: tenant.pricingPlans}))
    }

    if (checkIfPlatformSite()) {
      this.setPlatformBrandColors();
      // on the platform site, the only visible page should be the login page, used to identify the tenant. Then after login, the user gets redirected to the tenant website, where it will perform all the admin operations
      this.router.navigate(['/login']);
    }
    else if (tenant) {
      this.store.dispatch(themeChanged(tenant.brandTheme));
    }
  }


  setPlatformBrandColors() {
    this.store.dispatch(themeChanged(DEFAULT_THEME));
  }

}
