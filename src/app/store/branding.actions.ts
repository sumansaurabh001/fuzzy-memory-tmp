import { Action } from '@ngrx/store';


export enum BrandingActionTypes {
  SetBrandColors = '[BrandColorsLoaded] Action',
  SaveBrandColors = '[SaveBrandColors] Action'
}


export class SetBrandColors implements Action {

  readonly type = BrandingActionTypes.SetBrandColors;

  constructor(public payload: {primaryColor:string, accentColor:string}) {}

}

export class SaveBrandColors implements Action {

  readonly type = BrandingActionTypes.SaveBrandColors;

  constructor(public payload: {primaryColor:string, accentColor:string}) {}

}


export type BrandingActions = SetBrandColors | SaveBrandColors;
