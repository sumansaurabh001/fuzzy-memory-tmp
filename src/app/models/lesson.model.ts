export interface Lesson {
  id:string;
  status:  'draft' | 'ready' |  'published';
  sectionId:string;
  seqNo:string;
  title:string;
  videoFileName:string;
  videoDuration:number;
  thumbnail: string;
  duration:number;
  free: boolean;
}

