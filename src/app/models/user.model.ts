
import * as firebase from 'firebase/app';
import * as dayjs from 'dayjs';
import {isFutureTimestamp} from './date-utils';


export interface User {
  id:string;
  email:string;
  pictureUrl: string;
  displayName:string;
  roles?:string[];
  pricingPlan?:string;
  planActivatedAt?:firebase.firestore.Timestamp;
  planEndsAt?:firebase.firestore.Timestamp;
  stripeCustomerId?:string;
  stripeSubscriptionId?:string;
}


export function isUserPlanStillValid(user:User) {
  return user.pricingPlan && (!user.planEndsAt || isFutureTimestamp(user.planEndsAt) );
}

export function isUserPlanCanceled(user:User) {
  return user.pricingPlan && user.planEndsAt;
}
