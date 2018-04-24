import { Action } from '@ngrx/store';


export enum PlatformActionTypes {
  SetTheme = '[SetTheme] Action'
}


export class SetTheme implements Action {

  readonly type = PlatformActionTypes.SetTheme;

  constructor(public payload: {primaryColor:string, accentColor:string}) {}

}



export type PlatformActions = SetTheme;
