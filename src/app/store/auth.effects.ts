import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable, defer, of} from 'rxjs';
import {Action} from '@ngrx/store';
import {Login, Logout} from './auth.actions';
import {AngularFireAuth} from '@angular/fire/auth';
import {catchError, concatMap, filter, map, tap} from 'rxjs/operators';
import {TenantsDBService} from '../services/tenants-db.service';


@Injectable()
export class AuthEffects {


  @Effect()
  init$ = this.afAuth.authState
    .pipe(
      filter(authState => !!authState),
      concatMap(() => this.tenantsDB.findTenantByUid()),
      map(tenant => tenant ? new Login(tenant) : new Logout()),
      catchError(() => of(new Logout()))
    );


  constructor(private actions$: Actions,
              private afAuth: AngularFireAuth,
              private tenantsDB: TenantsDBService) {

  }

}
