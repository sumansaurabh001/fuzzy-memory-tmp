import { Action } from '@ngrx/store';
import {Theme} from '../models/theme.model';


export enum PlatformActionTypes {
  ThemeChanged = '[ThemeChanged] Action',
  SaveTheme = '[Branding Screen] Save Theme',
  LoadStripeStatus = '[Edit Course Screen] Load Stripe Status',
  UpdateStripeStatus = '[Platform API] Update Stripe Status'
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



export class UpdateStripeStatus {

  readonly type = PlatformActionTypes.UpdateStripeStatus;

  constructor(public payload: {isConnectedToStripe:boolean}) {}

}




export type PlatformActions = ThemeChanged | SaveTheme | LoadStripeConnectionStatus | UpdateStripeStatus;

