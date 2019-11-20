import {User} from './user.model';
import {PricingPlanDetails} from './pricing-plan-details.model';


export interface NewsletterFormContent {
  callToAction:string;
  infoNote:string
}


export interface TenantInfo {
  subDomain:string;
  schoolName: string;
  supportEmail:string;
  newsletter: NewsletterFormContent;
}

export interface Tenant extends User, TenantInfo {
  status: 'new';
  brandTheme: {
    primaryColor: string;
    accentColor: string;
  };
  pricingPlans: PricingPlanDetails
}
