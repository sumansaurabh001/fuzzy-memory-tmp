import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, concatMap, filter, map, withLatestFrom} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {AppState} from './index';
import {LoadingService} from '../services/loading.service';
import {MessagesService} from '../services/messages.service';
import {throwError as _throw} from 'rxjs';
import {PlatformActionTypes, SaveTheme, UpdateStripeSettings} from './platform.actions';
import {TenantsDBService} from '../services/tenants-db.service';
import {TenantService} from '../services/tenant.service';
import {defer, of} from 'rxjs';
import {isPlatformInitialized} from './selectors';

@Injectable()
export class PlatformEffects {

  @Effect({dispatch: false})
  saveTheme$ = this.actions$
    .pipe(
      ofType<SaveTheme>(PlatformActionTypes.SaveTheme),
      concatMap(action => this.tenantsDB.saveTheme(this.tenant.id, action.payload.primaryColor, action.payload.accentColor)),
      catchError(err => {
        this.messages.error('Could not save theme colors.');
        return _throw(err);
      })
    );


  @Effect()
  init$ = defer(() =>
    this.store.select(isPlatformInitialized)
      .pipe(
        filter(isPlatformInitialized => isPlatformInitialized),
        concatMap(() => this.tenantsDB.loadTenantStripeSettings(this.tenant.id)),
        map(settings => new UpdateStripeSettings(settings))
      )
  );


  constructor(private actions$: Actions,
              private tenant: TenantService,
              private store : Store<AppState>,
              private loading: LoadingService,
              private tenantsDB: TenantsDBService,
              private messages: MessagesService) {

  }


}
