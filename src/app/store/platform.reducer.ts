import {PlatformActions, PlatformActionTypes} from './platform.actions';


export interface PlatformState {
  primaryColor: string;
  accentColor:string;
  isConnectedToStripe: boolean
}

export const initialState: PlatformState = {
  primaryColor: undefined,
  accentColor: undefined,
  isConnectedToStripe: false
};

export function platformReducer(state = initialState, action: PlatformActions): PlatformState {
  switch (action.type) {

    case PlatformActionTypes.ThemeChanged:
      return {
        ...state,
        primaryColor: action.payload.primaryColor,
        accentColor: action.payload.accentColor
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
