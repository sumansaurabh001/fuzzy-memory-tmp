import { Action } from '@ngrx/store';


export enum BrandingActionTypes {
  SaveBrandColors = '[SaveBrandColors] Action'
}


export class SaveBrandColors implements Action {

  readonly type = BrandingActionTypes.SaveBrandColors;

  constructor(public payload: {primaryColor:string, accentColor:string}) {}

}


export type BrandingActions =  SaveBrandColors;
