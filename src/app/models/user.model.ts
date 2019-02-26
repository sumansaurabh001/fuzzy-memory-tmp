

export interface User {
  id:string;
  email:string;
  pictureUrl: string;
  displayName:string;
  roles?:string[];
  pricingPlan?:string;
  stripeCustomerId?:string;
  stripeSubscriptionId?:string;
}
