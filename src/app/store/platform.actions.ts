import {createAction, props} from '@ngrx/store';
import {Theme} from '../models/theme.model';
import {NewsletterFormContent, TenantInfo} from '../models/tenant.model';
import {EmailProviderSettings} from '../models/email-provider-settings.model';



export const themeChanged = createAction(
  '[ThemeChanged] Action',
  props<Theme>()
);

export const saveTheme = createAction(
  '[Branding Screen] Save Theme',
  props<Theme>()
);

export const loadStripeConnectionStatus = createAction(
  '[Edit Course Screen] Load Stripe Status'
);

export const updateStripeStatus = createAction(
  '[Platform API] Update Stripe Status',
  props<{isConnectedToStripe:boolean}>()
);

export const setTenantInfo = createAction(
  '[Platform Startup] Set Tenant Info',
  props<{tenantInfo:TenantInfo}>()
);

export const saveNewsletterFormContent = createAction(
  "[Admin Email Marketing] Save Newsletter Form Content",
  props<{newsletter: NewsletterFormContent}>()
);

export const loadEmailProviderSettings = createAction(
  "[Admin Email Marketing] Load Email Provider Settings"
);


export const emailProviderSettingsLoaded = createAction(
  "[Admin Email Marketing] Email Provider Settings Loaded",
  props<{emailProviderSettings: EmailProviderSettings}>()
);


export const activateEmailMarketingIntegration = createAction(
  "[Admin Email Marketing] Activate Email Marketing Integration",
  props<{emailProviderSettings: EmailProviderSettings}>()
);

export const cancelEmailMarketingIntegration = createAction(
  "[Admin Email Marketing] Cancel Email Marketing Integration"
);
