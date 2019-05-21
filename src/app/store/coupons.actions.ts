import {Action} from '@ngrx/store';
import {Update} from '@ngrx/entity';
import {Course} from '../models/course.model';
import {CourseCoupon} from '../models/coupon.model';
import {UpdateStr} from '../../../node_modules/@ngrx/entity/src/models';

export enum CouponActionTypes {
  LoadCoupons = '[Edit Course Screen]  Load Coupons',
  LoadCoupon = '[Course Page] Load Coupon',
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

  constructor(public payload: { coupons: CourseCoupon[] }) {}

}

export class AddCoupon implements Action {
  readonly type = CouponActionTypes.AddCoupon;

  constructor(public payload: { coupon: CourseCoupon }) {}

}


export class UpdateCoupon implements Action {
  readonly type = CouponActionTypes.UpdateCoupon;

  constructor(public payload: { courseId:string, coupon: UpdateStr<CourseCoupon> }) {}

}

export class LoadCoupon implements Action {

  readonly type = CouponActionTypes.LoadCoupon;

  constructor(public payload: {courseId:string; couponCode:string}) {}

}


export type CouponsActions =
  LoadCoupons
  | AddCoupons
  | AddCoupon
  | UpdateCoupon
  | LoadCoupon;
