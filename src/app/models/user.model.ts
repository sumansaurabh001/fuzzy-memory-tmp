
import * as firebase from 'firebase';


export interface User {
  id:string;
  email:string;
  pictureUrl: string;
  displayName:string;
  roles?:string[];
  pricingPlan?:string;
  planActivatedAt?:firebase.firestore.Timestamp;
  stripeCustomerId?:string;
  stripeSubscriptionId?:string;
}
