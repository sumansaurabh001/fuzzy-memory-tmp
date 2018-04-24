import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, concatMap} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {AppState} from './index';
import {LoadingService} from '../services/loading.service';
import {MessagesService} from '../services/messages.service';
import {_throw} from 'rxjs/observable/throw';
import {PlatformActionTypes, SaveTheme} from './platform.actions';
import {TenantsDBService} from '../services/tenants-db.service';
import {TenantService} from '../services/tenant.service';


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


  constructor(private actions$: Actions,
              private tenant: TenantService,
              private store : Store<AppState>,
              private loading: LoadingService,
              private tenantsDB: TenantsDBService,
              private messages: MessagesService) {

  }


}
