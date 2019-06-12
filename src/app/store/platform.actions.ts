import {createAction, props} from '@ngrx/store';
import {Theme} from '../models/theme.model';
import {TenantInfo} from '../models/tenant.model';



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

