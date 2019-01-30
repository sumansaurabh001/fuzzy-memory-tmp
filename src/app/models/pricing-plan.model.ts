
export interface PricingPlan {
  id:string;
  description:string;
  price:number;
  undiscountedPrice:number;
  frequency: 'monthly' | 'yearly' | 'lifetime';
  features: string[];
}


