export interface Lesson {
  id:string;
  status:  'draft'  | 'processing' | 'error' | 'ready' |  'published';
  sectionId:string;
  seqNo:number;
  title:string;
  originalFileName:string;
  videoDuration:number;
  thumbnail: string;
  duration:number;
  free: boolean;
}

