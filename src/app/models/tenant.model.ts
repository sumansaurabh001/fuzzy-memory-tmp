import {User} from './user.model';
import {PricingPlanDetails} from './pricing-plan-details.model';


export interface Tenant extends User {
  status: 'new';
  seqNo: number;
  brandTheme: {
    primaryColor: string;
    accentColor: string;
  };
  pricingPlans: PricingPlanDetails;
}
