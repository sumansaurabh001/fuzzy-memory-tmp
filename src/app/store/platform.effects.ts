import {Injectable} from '@angular/core';
import {Actions, createEffect, Effect, ofType} from '@ngrx/effects';
import {catchError, concatMap, filter, map, withLatestFrom} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {AppState} from './index';
import {LoadingService} from '../services/loading.service';
import {MessagesService} from '../services/messages.service';
import {TenantsDBService} from '../services/tenants-db.service';
import {TenantService} from '../services/tenant.service';
import {StripeConnectionService} from '../services/stripe-connection.service';
import {throwError} from 'rxjs';
import {PlatformActions} from './action-types';
import {emailProviderSettingsLoaded, updateStripeStatus} from './platform.actions';
import {selectEmailProviderSettings} from './selectors';
import * as firebase from 'firebase/app';


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
    {dispatch: false});

  loadStripeConnectionStatus$ = createEffect(() => this.tenant.tenantId$
    .pipe(
      filter(tenantId => !!tenantId),
      concatMap(() => this.stripeConnectionService.isConnectedToStripe(this.tenant.id)),
      map(isConnectedToStripe => updateStripeStatus({isConnectedToStripe}))
    ));

  saveNewsletter$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(PlatformActions.saveNewsletterFormContent),
        concatMap(action => this.loading.showLoaderUntilCompleted(
          this.tenantsDB.updateTenant(this.tenant.id, {newsletter: action.newsletter})))
      ), {dispatch: false}
  );

  loadEmailProviderSettings$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(PlatformActions.loadEmailProviderSettings),
        concatMap(() => this.tenantsDB.loadTenantPrivateSettings(this.tenant.id)),
        map(settings => emailProviderSettingsLoaded({emailProviderSettings: settings.emailProvider}))
      ));

  saveEmailProviderSettings$ = createEffect(() =>
      this.actions$
        .pipe(
          ofType(PlatformActions.activateEmailMarketingIntegration),
          concatMap(action => this.tenantsDB.updateTenantSettings(this.tenant.id, {emailProvider: action.emailProviderSettings}))
        ),
    {dispatch: false});


  cancelEmailProviderIntegration$ = createEffect(() =>
  this.actions$
    .pipe(
      ofType(PlatformActions.cancelEmailMarketingIntegration),
      withLatestFrom(this.store.pipe(select(selectEmailProviderSettings))),
      concatMap(([action, settings]) =>  this.tenantsDB.updateTenantSettings(this.tenant.id, {emailProvider: <any>firebase.firestore.FieldValue.delete()  })
      )
    ), {dispatch: false});

  constructor(private actions$: Actions,
              private tenant: TenantService,
              private store: Store<AppState>,
              private loading: LoadingService,
              private tenantsDB: TenantsDBService,
              private stripeConnectionService: StripeConnectionService,
              private messages: MessagesService) {

  }


}
