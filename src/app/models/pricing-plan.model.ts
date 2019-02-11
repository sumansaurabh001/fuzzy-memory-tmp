
export interface PricingPlan {
  id:string;
  stripePlanId:string;
  description:string;
  price:number;
  undiscountedPrice:number;
  frequency: 'month' | 'year' | 'lifetime';
  features: string[];
}


