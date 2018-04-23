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
          if (isPlatformSite && !auth) {
            this.router.navigate(['/login']);
            return of(undefined);
          }
          else if (isPlatformSite) {
            return this.loading.showLoader(this.tenantDB.findTenantByUid());
          }
          else {

            //TODO - not platform site, get the tenantId from DB in /hosts (lookup by hostname)

          }

        }),
        tap(tenant => {
          if (tenant) {
            this.tenant.id = tenant.id;
          }
        }),
        map(tenant => !!tenant)
      );
  }

}
