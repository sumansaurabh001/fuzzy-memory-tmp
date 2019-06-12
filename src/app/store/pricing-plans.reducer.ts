import {PricingPlan} from '../models/pricing-plan.model';
import {createReducer, on} from '@ngrx/store';
import {PricingPlanActions} from './action-types';


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


export const pricingPlansReducer = createReducer(
  initialState,

  on(PricingPlanActions.pricingPlansLoaded, (state,action) => {
    return {
      ...state,
      lifetimePlan: action.pricingPlans.lifetimePlan,
      yearlyPlan: action.pricingPlans.yearlyPlan,
      monthlyPlan: action.pricingPlans.monthlyPlan
    };
  }),

  on(PricingPlanActions.updatePricingPlan, (state, action) => {
    const newState = {...state};

    const newPlan = {
      ...newState[action.planName],
      ...action.changes
    };

    newState[action.planName] = newPlan;

    return newState;
  })

);

