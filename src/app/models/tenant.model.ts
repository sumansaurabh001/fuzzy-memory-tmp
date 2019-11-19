import {User} from './user.model';
import {PricingPlanDetails} from './pricing-plan-details.model';


export interface TenantInfo {
  subDomain:string;
  schoolName: string;
  supportEmail:string;
}


export interface Tenant extends User, TenantInfo {
  status: 'new';
  brandTheme: {
    primaryColor: string;
    accentColor: string;
  };
  pricingPlans: PricingPlanDetails;
}
