export interface Course {
  id:string;
  url: string;
  status: 'draft' | 'published';
  title: string;
  subTitle:string;
  shortDescription: string;
  thumbnailUrl: string;
}
