import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable, defer, of, zip, combineLatest} from 'rxjs';
import {Action} from '@ngrx/store';
import {Login, Logout} from './auth.actions';
import {AngularFireAuth} from '@angular/fire/auth';
import {catchError, concatMap, filter, map, tap, withLatestFrom} from 'rxjs/operators';
import {TenantsDBService} from '../services/tenants-db.service';
import {checkIfPlatformSite} from '../common/platform-utils';
import {SchoolUsersDbService} from '../services/school-users-db.service';
import {TenantService} from '../services/tenant.service';


@Injectable()
export class AuthEffects {


  @Effect()
  login$ = combineLatest(
    this.afAuth.authState,
    this.tenant.tenantId$
  )
    .pipe(
      filter(([authState, tenantId]) => !!authState && !!tenantId),
      concatMap(() => {
        if (checkIfPlatformSite()) {
          return this.tenantsDB.findTenantByCurrentUid();
        }
        else {
          return this.schoolUsersDB.findUserByCurrentUid();
        }
      }),
      map(userProfile => userProfile ? new Login(userProfile) : new Logout()),
      catchError(() => of(new Logout()))
    );


  constructor(private actions$: Actions,
              private afAuth: AngularFireAuth,
              private tenantsDB: TenantsDBService,
              private schoolUsersDB: SchoolUsersDbService,
              private tenant: TenantService) {

  }

}
