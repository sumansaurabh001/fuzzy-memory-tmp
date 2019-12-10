
import * as firebase from 'firebase/app';

export interface TeamMember {
  id:string;
  email:string;
  name:string;
  status: "pending" | "active";
  lastActivationEmailSentAt: firebase.firestore.Timestamp;
  activatedAt: firebase.firestore.Timestamp;
}
