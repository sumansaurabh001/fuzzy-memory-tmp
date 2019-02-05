import {PricingPlan} from '../models/pricing-plan.model';
import {PricingPlanActionTypes, PricingPlansActions} from './pricing-plans.actions';


export interface PricingPlansState {
  monthlyPlan: PricingPlan;
  yearlyPlan: PricingPlan;
  lifetimeAccessPrice: number;
}


export const initialState: PricingPlansState = {
  monthlyPlan: undefined,
  yearlyPlan: undefined,
  lifetimeAccessPrice: undefined
};


export function pricingPlansReducer(state = initialState, action: PricingPlansActions) {
  switch (action.type) {

    case PricingPlanActionTypes.PricingPlansLoaded:
      return {
        ...state,
        lifetimeAccessPrice: action.payload.pricingPlans.lifetimeAccessPrice,
        yearlyPlan: action.payload.pricingPlans.yearlyPlan,
        monthlyPlan: action.payload.pricingPlans.monthlyPlan
      };


    default:
      return state;
  }

}
