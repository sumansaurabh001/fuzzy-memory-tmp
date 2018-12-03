
import * as firebase from 'firebase/app';


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
