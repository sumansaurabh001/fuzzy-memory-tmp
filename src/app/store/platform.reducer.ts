import { Action } from '@ngrx/store';
import {PlatformActions, PlatformActionTypes} from './platform.actions';



export interface PlatformState {
  primaryColor: string;
  accentColor:string;
  stripeTenantUserId:string;
}

export const initialState: PlatformState = {
  primaryColor: undefined,
  accentColor: undefined,
  stripeTenantUserId: undefined
};

export function platformReducer(state = initialState, action: PlatformActions): PlatformState {
  switch (action.type) {

    case PlatformActionTypes.ThemeChanged:
      return {
        ...state,
        primaryColor: action.payload.primaryColor,
        accentColor: action.payload.accentColor
      }

    default:
      return state;
  }
}
