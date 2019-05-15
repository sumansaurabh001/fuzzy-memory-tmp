import { Action } from '@ngrx/store';
import {Theme} from '../models/theme.model';
import {TenantInfo} from '../models/tenant.model';


export enum PlatformActionTypes {
  ThemeChanged = '[ThemeChanged] Action',
  SaveTheme = '[Branding Screen] Save Theme',
  LoadStripeStatus = '[Edit Course Screen] Load Stripe Status',
  UpdateStripeStatus = '[Platform API] Update Stripe Status',
  SetTenantInfo = '[Platform Startup] Set Tenant Info'
}


export class ThemeChanged implements Action {

  readonly type = PlatformActionTypes.ThemeChanged;

  constructor(public payload: Theme) {}

}

export class SaveTheme implements Action {

  readonly type = PlatformActionTypes.SaveTheme;

  constructor(public payload: Theme) {}

}


export class LoadStripeConnectionStatus {

  readonly type = PlatformActionTypes.LoadStripeStatus;

  constructor() {}

}



export class UpdateStripeStatus implements Action {

  readonly type = PlatformActionTypes.UpdateStripeStatus;

  constructor(public payload: {isConnectedToStripe:boolean}) {}

}

export class SetTenantInfo implements Action {

  readonly type = PlatformActionTypes.SetTenantInfo;

  constructor(public payload: {tenantInfo:TenantInfo}) {}

}




export type PlatformActions = ThemeChanged | SaveTheme | LoadStripeConnectionStatus | UpdateStripeStatus | SetTenantInfo;

