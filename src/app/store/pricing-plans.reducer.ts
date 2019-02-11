import {PricingPlan} from '../models/pricing-plan.model';
import {PricingPlanActionTypes, PricingPlansActions} from './pricing-plans.actions';


export interface PricingPlansState {
  monthlyPlan: PricingPlan;
  yearlyPlan: PricingPlan;
  lifetimePlan: PricingPlan;
}


export const initialState: PricingPlansState = {
  monthlyPlan: undefined,
  yearlyPlan: undefined,
  lifetimePlan: undefined
};


export function pricingPlansReducer(state = initialState, action: PricingPlansActions) {
  switch (action.type) {

    case PricingPlanActionTypes.PricingPlansLoaded:
      return {
        ...state,
        lifetimePlan: action.payload.pricingPlans.lifetimePlan,
        yearlyPlan: action.payload.pricingPlans.yearlyPlan,
        monthlyPlan: action.payload.pricingPlans.monthlyPlan
      };

    case PricingPlanActionTypes.UpdatePricingPlan:

      const newState = {...state};

      const newPlan = {
        ...newState[action.payload.planName],
        ...action.payload.changes
      };

      newState[action.payload.planName] = newPlan;

      return newState;

    default:
      return state;
  }

}
