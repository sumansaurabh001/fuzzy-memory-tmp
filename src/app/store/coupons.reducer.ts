
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {CourseCoupon} from '../models/coupon.model';
import {createReducer, on} from '@ngrx/store';
import {CouponActions} from './action-types';


export interface CouponsState extends EntityState<CourseCoupon> {

}

export const adapter: EntityAdapter<CourseCoupon> = createEntityAdapter<CourseCoupon>({
  sortComparer: (c1, c2) => {

    return c2.created.toDate().getTime() - c1.created.toDate().getTime();
  }
});


export const initialCouponsState: CouponsState = adapter.getInitialState({

});


export const couponsReducer = createReducer(
  initialCouponsState,

  on(CouponActions.addCoupons, (state, {coupons}) => adapter.addMany(coupons, state)),

  on(
    CouponActions.addCoupon,
    CouponActions.loadCouponCompleted,
    (state, {coupon}) =>  adapter.addOne(coupon, state)
  ),

  on(
    CouponActions.updateCoupon,
    (state, {coupon}) => adapter.updateOne(coupon, state)
  )

);


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();



