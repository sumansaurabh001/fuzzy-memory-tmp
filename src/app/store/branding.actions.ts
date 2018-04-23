import { Action } from '@ngrx/store';

export enum BrandingActionTypes {
  SetBrandColorsAction = '[SetBrandColorsAction] Action'
}

export class SetBrandColors implements Action {
  readonly type = BrandingActionTypes.SetBrandColorsAction;

  constructor(public payload: {primaryColor:string, accentColor:string}) {}

}



export type BrandingActions = SetBrandColors;
