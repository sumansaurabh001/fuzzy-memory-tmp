import {Action, createAction, props} from '@ngrx/store';
import {Update} from '@ngrx/entity';
import {CourseCoupon} from '../models/coupon.model';
import {UpdateStr} from '../../../node_modules/@ngrx/entity/src/models';



export const loadCoupons = createAction(
  '[Edit Course Screen]  Load Coupons',
  props<{activeCouponsOnly:boolean }>()
);

export const addCoupons = createAction(
  '[Coupon] Add Coupons',
  props<{ coupons: CourseCoupon[] }>()
);




export const addCoupon = createAction(
  '[Coupon] Add Coupon',
  props<{ coupon: CourseCoupon }>()
);



export const updateCoupon = createAction(
  '[Coupon] Update Coupon',
  props<{ courseId:string, coupon: UpdateStr<CourseCoupon> }>()
);



export const loadCoupon = createAction(
  '[Course Page] Load Coupon',
  props<{courseId:string; couponCode:string}>()
);



export const loadCouponCompleted = createAction(
  '[Load Coupon Effect] Load Coupon Completed',
  props<{ coupon: CourseCoupon }>()
);



