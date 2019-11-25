/**
 *
 *  This is private data about the tenant that is only visible by the tenant itself, or by Firebase Cloud Functions.
 *
 */
import {EmailProviderSettings} from './email-provider-settings.model';

export interface TenantSettings {
  stripeTenantUserId: string;
  stripeRefreshToken: string;
  emailProvider: EmailProviderSettings
}


