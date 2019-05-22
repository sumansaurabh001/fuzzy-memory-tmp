
import * as firebase from 'firebase/app';
import {isFutureTimestamp} from './date-utils';


export interface CourseCoupon {
  id:string;
  courseId:string;
  code:string;
  price:number;
  free:boolean;
  remaining:number;
  created:firebase.firestore.Timestamp;
  deadline:firebase.firestore.Timestamp;
  active: boolean;
}


export function isValidCoupon(coupon:CourseCoupon) {
  if (!coupon) {
    return false;
  }

  return coupon.active && coupon.remaining > 0 && (!coupon.deadline || isFutureTimestamp(coupon.deadline));

}
