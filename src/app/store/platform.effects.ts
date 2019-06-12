import {Injectable} from '@angular/core';
import {Actions, createEffect, Effect, ofType} from '@ngrx/effects';
import {catchError, concatMap, filter, map, withLatestFrom} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {AppState} from './index';
import {LoadingService} from '../services/loading.service';
import {MessagesService} from '../services/messages.service';
import {TenantsDBService} from '../services/tenants-db.service';
import {TenantService} from '../services/tenant.service';
import {StripeConnectionService} from '../services/stripe-connection.service';
import {throwError} from "rxjs";
import {PlatformActions} from './action-types';
import {updateStripeStatus} from './platform.actions';

@Injectable()
export class PlatformEffects {

  saveTheme$ = createEffect(() => this.actions$
    .pipe(
      ofType(PlatformActions.saveTheme),
      concatMap(theme => this.tenantsDB.saveTheme(this.tenant.id, theme.primaryColor, theme.accentColor)),
      catchError(err => {
        this.messages.error('Could not save theme colors.');
        return throwError(err);
      })
    ),
    {dispatch:false});

  loadStripeConnectionStatus$ = createEffect(() => this.tenant.tenantId$
    .pipe(
      filter(tenantId => !!tenantId),
      concatMap(() => this.stripeConnectionService.isConnectedToStripe(this.tenant.id)),
      map(isConnectedToStripe => updateStripeStatus({isConnectedToStripe}))
    ));


  constructor(private actions$: Actions,
              private tenant: TenantService,
              private store : Store<AppState>,
              private loading: LoadingService,
              private tenantsDB: TenantsDBService,
              private stripeConnectionService: StripeConnectionService,
              private messages: MessagesService) {

  }


}
