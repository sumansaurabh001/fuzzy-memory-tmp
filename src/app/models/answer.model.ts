
import * as firebase from 'firebase/app';

export interface Answer {
  id:string;
  answer:string;
  userDisplayName:string;
  userPictureUrl:string;
  createdAt?:firebase.firestore.Timestamp;
}
