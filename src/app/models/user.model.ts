

export interface User {
  id:string;
  email:string;
  pictureUrl: string;
  displayName:string;
  roles?:string[];
  stripeCustomerId?:string;
}
