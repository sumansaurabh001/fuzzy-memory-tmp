export interface Course {
  id:string;
  url: string;
  status: 'draft' | 'published'
  title: string;
  seqNo:number;
  subTitle:string;
  shortDescription: string;
  thumbnail: string;
}
