import {Action} from '@ngrx/store';
import {PricingPlanDetails} from '../models/pricing-plan-details.model';
import {PricingPlan} from '../models/pricing-plan.model';


export enum PricingPlanActionTypes {
  PricingPlansLoaded = '[Platform Guard] Pricing Plans Loaded',
  UpdatePricingPlan = '[Edit Plan Dialog] Update Pricing Plan'

}

export class PricingPlansLoaded implements Action {

  readonly type = PricingPlanActionTypes.PricingPlansLoaded;

  constructor(public payload: {pricingPlans: PricingPlanDetails}) {}

}


export class UpdatePricingPlan implements Action {

  readonly type = PricingPlanActionTypes.UpdatePricingPlan;

  constructor(public payload: {planName:string, changes: Partial<PricingPlan>}) {}

}

export type PricingPlansActions = PricingPlansLoaded | UpdatePricingPlan;

