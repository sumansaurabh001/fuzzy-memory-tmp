import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromCoupon from './coupons.reducer';
import {selectActiveCourse} from './selectors';
import {CouponsState} from './coupons.reducer';

export const couponsState = createFeatureSelector<CouponsState>('coupons');


export const selectAllCoupons = createSelector(couponsState, fromCoupon.selectAll);

export const selectActiveCourseCoupons = createSelector(
  selectAllCoupons,
  selectActiveCourse,
  (coupons, course) => coupons.filter(coupon => coupon.courseId == course.id && coupon.active)
);

export const selectAllCourseCoupons = createSelector(
  selectAllCoupons,
  selectActiveCourse,
  (coupons, course) => coupons.filter(coupon => coupon.courseId == course.id)
);


export const selectCouponByCode = (couponCode:string) => createSelector(
  selectAllCoupons,
  selectActiveCourse,
  (coupons, course) => coupons.find(coupon => coupon.courseId == course.id && coupon.code == couponCode)
);
