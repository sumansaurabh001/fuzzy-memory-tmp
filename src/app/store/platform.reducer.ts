import {PlatformActions, PlatformActionTypes} from './platform.actions';
import {Theme} from '../models/theme.model';
import {TenantInfo} from '../models/tenant.model';


export interface PlatformState {
  brandTheme: Theme,
  isConnectedToStripe: boolean | null,
  tenantInfo: TenantInfo
}

export const initialState: PlatformState = {
  brandTheme: undefined,
  isConnectedToStripe: null,
  tenantInfo: null
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

    case PlatformActionTypes.SetTenantInfo:
      return {
        ...state,
        tenantInfo: action.payload.tenantInfo
      };

    default:
      return state;
  }
}
