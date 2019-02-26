

export interface User {
  id:string;
  email:string;
  pictureUrl: string;
  displayName:string;
  roles?:string[];
  pricingPlanId?:string;
  stripeCustomerId?:string;
  stripeSubscriptionId?:string;
}
