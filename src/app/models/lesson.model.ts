export interface Lesson {
  id:string;
  status:  'draft' | 'ready' |  'published'; // publication status
  uploadStatus:  'processing' | 'error' | 'done';
  sectionId:string;
  seqNo:number; // this is the section sequence number, stored in the database, used for reordering lessons
  courseSeqNo:number; // this is overall course sequence number, calculated in the frontend at course startup time
  title:string;
  originalFileName:string;
  videoDuration:number;
  thumbnail: string;
  duration:number;
  free: boolean;
}

