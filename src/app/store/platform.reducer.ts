
import {Theme} from '../models/theme.model';
import {TenantInfo} from '../models/tenant.model';
import {createReducer, on} from '@ngrx/store';
import {PlatformActions} from './action-types';


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


export const platformReducer = createReducer(

  initialState,

  on(PlatformActions.themeChanged, (state,theme) => {
    return {
      ...state,
      brandTheme: theme
    }
  }),

  on(PlatformActions.updateStripeStatus, (state,action) => {
    return {
      ...state,
      isConnectedToStripe: action.isConnectedToStripe
    };
  }),

  on(PlatformActions.setTenantInfo, (state,action) => {
    return {
      ...state,
      tenantInfo: action.tenantInfo
    };
  })

);

