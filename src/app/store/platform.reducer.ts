import {PlatformActions, PlatformActionTypes} from './platform.actions';
import {Theme} from '../models/theme.model';


export interface PlatformState {
  brandTheme: Theme,
  isConnectedToStripe: boolean
}

export const initialState: PlatformState = {
  brandTheme: undefined,
  isConnectedToStripe: false
};

export function platformReducer(state = initialState, action: PlatformActions): PlatformState {
  switch (action.type) {

    case PlatformActionTypes.ThemeChanged:
      return {
        ...state,
        brandTheme: action.payload
      };

    case PlatformActionTypes.UpdateStripeStatus:
      return {
        ...state,
        isConnectedToStripe: action.payload.isConnectedToStripe
      };

    default:
      return state;
  }
}
