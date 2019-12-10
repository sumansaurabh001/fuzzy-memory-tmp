
import * as firebase from 'firebase/app';
import {isFutureTimestamp} from './date-utils';


export interface User {
  id:string;
  email?:string;
  pictureUrl?: string;
  displayName?:string;
  pricingPlan?:string;
  isTeamPlan?:boolean;
  planActivatedAt?:firebase.firestore.Timestamp;
  planEndsAt?:firebase.firestore.Timestamp;
  stripeCustomerId?:string;
  stripeSubscriptionId?:string;
  cardLast4Digits?:string;
  cardExpirationMonth?:string;
  cardExpirationYear?:string;
  testUser?:boolean;
  addedToNewsletter?:boolean;
}

export const ANONYMOUS_USER: User = {
  id: 'anonymous',
  testUser: false
};

export function isAnonymousUser(user:User) {
  return user && user.id == 'anonymous';
}

export function isUserPlanStillValid(user:User) {
  return user.pricingPlan && (!user.planEndsAt || isFutureTimestamp(user.planEndsAt) );
}

export function isUserPlanCanceled(user:User) {
  return user.pricingPlan && user.planEndsAt;
}
