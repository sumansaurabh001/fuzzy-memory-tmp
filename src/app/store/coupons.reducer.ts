import {CouponActionTypes, CouponsActions} from './coupons.actions';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {CourseCoupon} from '../models/coupon.model';


export interface CouponsState extends EntityState<CourseCoupon> {

}

export const adapter: EntityAdapter<CourseCoupon> = createEntityAdapter<CourseCoupon>();


export const initialCouponsState: CouponsState = adapter.getInitialState({

});


export function couponsReducer(state = initialCouponsState, action: CouponsActions): CouponsState {

  switch (action.type) {

    case CouponActionTypes.AddCoupons:
      return adapter.addMany(action.payload.coupons, state);

    case CouponActionTypes.AddCoupon:

    case CouponActionTypes.UpdateCoupon:


    default:
      return state;
  }
}



export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();



