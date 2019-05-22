
export interface Course {
  id:string;
  url: string;
  status: 'draft' | 'published'
  title: string;
  seqNo:number;
  subTitle:string;
  shortDescription: string;
  thumbnail: string;
  downloadAllowed: boolean;
  price:number;
  includedInSubscription:boolean;
  free:boolean;
  totalDuration:number;
}
