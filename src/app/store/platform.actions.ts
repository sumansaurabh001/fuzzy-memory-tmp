import { Action } from '@ngrx/store';
import {Theme} from '../models/theme.model';


export enum PlatformActionTypes {
  ThemeChanged = '[ThemeChanged] Action',
  SaveTheme = '[SaveTheme] Action'
}


export class ThemeChanged implements Action {

  readonly type = PlatformActionTypes.ThemeChanged;

  constructor(public payload: Theme) {}

}



export class SaveTheme implements Action {

  readonly type = PlatformActionTypes.SaveTheme;

  constructor(public payload: Theme) {}

}


export type PlatformActions = ThemeChanged | SaveTheme;
