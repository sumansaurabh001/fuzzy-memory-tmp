import {Action} from '@ngrx/store';
import {PricingPlanDetails} from '../models/pricing-plan-details.model';


export enum PricingPlanActionTypes {
  PricingPlansLoaded = '[Platform Guard] Pricing Plans Loaded'

}

export class PricingPlansLoaded implements Action {

  readonly type = PricingPlanActionTypes.PricingPlansLoaded;

  constructor(public payload: {pricingPlans: PricingPlanDetails}) {}

}

export type PricingPlansActions = PricingPlansLoaded;

