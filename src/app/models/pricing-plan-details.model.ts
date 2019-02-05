import {PricingPlan} from './pricing-plan.model';


export interface PricingPlanDetails {
  monthlyPlan: PricingPlan;
  yearlyPlan: PricingPlan;
  lifetimePlan: PricingPlan;
}
