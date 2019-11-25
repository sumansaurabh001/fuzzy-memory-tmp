import {Theme} from '../models/theme.model';
import {TenantInfo} from '../models/tenant.model';
import {createReducer, on} from '@ngrx/store';
import {PlatformActions} from './action-types';
import {EmailProviderSettings} from '../models/email-provider-settings.model';


export interface PlatformState {
  brandTheme: Theme,
  isConnectedToStripe: boolean | null,
  tenantInfo: TenantInfo,
  emailProvider: EmailProviderSettings
}

export const initialState: PlatformState = {
  brandTheme: undefined,
  isConnectedToStripe: undefined,
  tenantInfo: undefined,
  emailProvider: undefined
};


export const platformReducer = createReducer(

  initialState,

  on(PlatformActions.themeChanged, (state, theme) => {
    return {
      ...state,
      brandTheme: theme
    };
  }),

  on(PlatformActions.updateStripeStatus, (state, action) => {
    return {
      ...state,
      isConnectedToStripe: action.isConnectedToStripe
    };
  }),

  on(PlatformActions.setTenantInfo, (state, action) => {
    return {
      ...state,
      tenantInfo: action.tenantInfo
    };
  }),

  on(PlatformActions.saveNewsletterFormContent, (state, action) => {

    const tenantInfo = {...state.tenantInfo};

    tenantInfo.newsletter = action.newsletter;

    return {
      ...state,
      tenantInfo
    };
  }),

  on(PlatformActions.emailProviderSettingsLoaded, (state, action) => {
    return {
      ...state,
      emailProvider: action.emailProviderSettings
    }
  })

);

