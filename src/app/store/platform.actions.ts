import { Action } from '@ngrx/store';


export enum PlatformActionTypes {
  SetTheme = '[SetTheme] Action',
  SaveTheme = '[SaveTheme] Action'
}


export class SetTheme implements Action {

  readonly type = PlatformActionTypes.SetTheme;

  constructor(public payload: {primaryColor:string, accentColor:string}) {}

}



export class SaveTheme implements Action {

  readonly type = PlatformActionTypes.SaveTheme;

  constructor(public payload: {primaryColor:string, accentColor:string}) {}

}


export type PlatformActions = SetTheme | SaveTheme;
