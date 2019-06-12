import {Action, createAction, props} from '@ngrx/store';
import {PricingPlanDetails} from '../models/pricing-plan-details.model';
import {PricingPlan} from '../models/pricing-plan.model';



export const pricingPlansLoaded = createAction(
  '[Platform Guard] Pricing Plans Loaded',
  props<{pricingPlans: PricingPlanDetails}>()
);



export const updatePricingPlan = createAction(
  '[Edit Plan Dialog] Update Pricing Plan',
  props<{planName:string, changes: Partial<PricingPlan>}>()
);


