export interface Lesson {
  id:string;
  status:  'draft' | 'ready' |  'published';
  sectionId:string;
  seqNo:string;
  title:string;
  fileName:string;
  duration:number;
  free: boolean;
}

