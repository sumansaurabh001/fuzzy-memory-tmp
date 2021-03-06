import * as firebase from 'firebase/app';

export interface Question {
  id:string;
  title:string;
  questionText?:string;
  userId:string;
  userDisplayName?:string;
  userPictureUrl?:string;
  createdAt?:firebase.firestore.Timestamp;
  repliesCount?:number;
}


