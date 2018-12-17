import { Action } from '@ngrx/store';
import {Theme} from '../models/theme.model';


export enum PlatformActionTypes {
  ThemeChanged = '[ThemeChanged] Action',
  SaveTheme = '[Branding Screen] Save Theme',
  UpdateStripeSettings = '[Stripe Redirect Page] Update Stripe Settings'
}


export class ThemeChanged implements Action {

  readonly type = PlatformActionTypes.ThemeChanged;

  constructor(public payload: Theme) {}

}



export class SaveTheme implements Action {

  readonly type = PlatformActionTypes.SaveTheme;

  constructor(public payload: Theme) {}

}


export class UpdateStripeSettings implements Action {

  readonly type = PlatformActionTypes.UpdateStripeSettings;

  constructor(public payload: {stripeTenantUserId:string}) {}

}


export type PlatformActions = ThemeChanged | SaveTheme | UpdateStripeSettings;

