import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable, defer, of, zip, combineLatest} from 'rxjs';
import {Action} from '@ngrx/store';
import {Login, Logout, SetUserPermissions} from './auth.actions';
import {AngularFireAuth} from '@angular/fire/auth';
import {catchError, concatMap, filter, map, tap, withLatestFrom} from 'rxjs/operators';
import {TenantsDBService} from '../services/tenants-db.service';
import {checkIfPlatformSite} from '../common/platform-utils';
import {SchoolUsersDbService} from '../services/school-users-db.service';
import {TenantService} from '../services/tenant.service';


@Injectable()
export class AuthEffects {


  @Effect()
  login$ = this.afAuth.authState
    .pipe(
      map(user => user ? new Login({displayName: user.displayName, email:user.email, pictureUrl: user.photoURL, id:user.uid}) : new Logout()),
      catchError(() => of(new Logout()))
    );

  @Effect()
  userRoles = this.afAuth.idTokenResult
    .pipe(
      filter(result => !!result),
      map(result => new SetUserPermissions({isAdmin: result.claims.isAdmin})),
      catchError(() => of(new Logout()))
    );


  constructor(private actions$: Actions,
              private afAuth: AngularFireAuth,
              private tenantsDB: TenantsDBService,
              private schoolUsersDB: SchoolUsersDbService,
              private tenant: TenantService) {

  }

}
