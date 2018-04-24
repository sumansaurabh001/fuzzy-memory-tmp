import { Action } from '@ngrx/store';
import {BrandingActions, BrandingActionTypes} from '../store/branding.actions';


export interface BrandingState {
  primaryColor: string;
  accentColor:string;
}

export const initialState: BrandingState = {
  primaryColor: undefined,
  accentColor: undefined
};

export function brandingReducer(state = initialState, action: BrandingActions): BrandingState {
  switch (action.type) {

    case BrandingActionTypes.SetBrandColorsAction:
      return {
        ...state,
        primaryColor: action.payload.primaryColor,
        accentColor: action.payload.accentColor
      }

    default:
      return state;
  }
}
