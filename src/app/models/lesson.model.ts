export interface Lesson {
  id:string;
  status:  'draft' | 'ready' |  'published';
  sectionId:string;
  seqNo:string;
  title:string;
  videoFileName:string;
  thumbnail: string;
  duration:number;
  free: boolean;
}

