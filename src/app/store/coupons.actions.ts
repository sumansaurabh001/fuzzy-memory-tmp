import {Action} from '@ngrx/store';
import {Update} from '@ngrx/entity';
import {Course} from '../models/course.model';
import {CourseCoupon} from '../models/coupon.model';

export enum CouponActionTypes {
  LoadCoupons = '[Coupon]  Load Coupons',
  AddCoupons = '[Coupon] Add Coupons',
  AddCoupon = '[Coupon] Add Coupon',
  UpdateCoupon = '[Coupon] Update Coupon'

}


export class LoadCoupons implements Action {
  readonly type = CouponActionTypes.LoadCoupons;

  constructor(public payload: {activeCouponsOnly:boolean }) {
  }
}


export class AddCoupons implements Action {
  readonly type = CouponActionTypes.AddCoupons;

  constructor(public payload: { coupons: CourseCoupon[] }) {
  }
}

export class AddCoupon implements Action {
  readonly type = CouponActionTypes.AddCoupon;

  constructor(public payload: { coupon: CourseCoupon }) {
  }
}


export class UpdateCoupon implements Action {
  readonly type = CouponActionTypes.UpdateCoupon;

  constructor(public payload: { coupon: Update<CourseCoupon> }) {
  }
}


export type CouponsActions =
  LoadCoupons
  | AddCoupons
  | AddCoupon
  | UpdateCoupon;
