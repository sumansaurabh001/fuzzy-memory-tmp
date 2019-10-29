
import * as firebase from 'firebase/app';

export interface Answer {
  id:string;
  answerText:string;
  userDisplayName:string;
  userPictureUrl:string;
  createdAt?:firebase.firestore.Timestamp;
}
