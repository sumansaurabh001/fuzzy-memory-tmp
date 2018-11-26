
export interface CourseCoupon {
  id:string;
  code:string;
  price:number;
  free:boolean;
  remaining:number;
  created:Date;
  deadline:Date;
  active: boolean;
}
