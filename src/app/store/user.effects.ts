import {Injectable} from '@angular/core';
import {Actions, createEffect, Effect} from '@ngrx/effects';
import {Observable, defer, of, zip, combineLatest} from 'rxjs';
import {Action} from '@ngrx/store';
import {AngularFireAuth} from '@angular/fire/auth';
import {catchError, concatMap, filter, map, tap, withLatestFrom} from 'rxjs/operators';
import {TenantsDBService} from '../services/tenants-db.service';
import {checkIfPlatformSite} from '../common/platform-utils';
import {SchoolUsersDbService} from '../services/school-users-db.service';
import {TenantService} from '../services/tenant.service';
import {login, logout, setUserPermissions, userLoaded} from './user.actions';
import {LoadingService} from '../services/loading.service';


@Injectable()
export class UserEffects {


  login$ = createEffect(() => this.afAuth.authState
    .pipe( 
      filter(user => !!user),
      map(user => login({displayName: user.displayName, email:user.email, pictureUrl: user.photoURL, id:user.uid}))
    ));

  loadUser$ = createEffect(() => combineLatest(this.afAuth.authState, this.tenant.tenantId$)
    .pipe(
      filter(([user]) => !!user),
      concatMap(([user]) => this.loading.showLoaderUntilCompleted(this.users.findUserByUid(user.uid))),
      map(user => userLoaded({user}))
    ));

  userRoles$ = createEffect(() => this.afAuth.idTokenResult
    .pipe(
      filter(result => !!result),
      map(result => setUserPermissions({isAdmin: result.claims.isAdmin}))
    ));


  constructor(private actions$: Actions,
              private afAuth: AngularFireAuth,
              private tenant: TenantService,
              private users: SchoolUsersDbService,
              private loading:LoadingService) {

  }

}
