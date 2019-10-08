import * as firebase from 'firebase/app';


export interface LatestLesson {
  courseId:string;
  sectionId: string;
  seqNo: number;
  title: string;
  videoDuration: number;
  free: boolean;
  lastUpdated:  firebase.firestore.Timestamp;
}
