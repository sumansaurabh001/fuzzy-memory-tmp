import {PlatformActions, PlatformActionTypes} from './platform.actions';
import {StripeSettings} from '../models/stripe-settings';


export interface PlatformState {
  primaryColor: string;
  accentColor:string;
  stripeSettings: StripeSettings
}

export const initialState: PlatformState = {
  primaryColor: undefined,
  accentColor: undefined,
  stripeSettings: undefined
};

export function platformReducer(state = initialState, action: PlatformActions): PlatformState {
  switch (action.type) {

    case PlatformActionTypes.ThemeChanged:
      return {
        ...state,
        primaryColor: action.payload.primaryColor,
        accentColor: action.payload.accentColor
      };

    case PlatformActionTypes.UpdateStripeSettings:
        return {
          ...state,
          stripeSettings: {stripeTenantUserId: action.payload ? action.payload.stripeTenantUserId : undefined}
        };

    default:
      return state;
  }
}
