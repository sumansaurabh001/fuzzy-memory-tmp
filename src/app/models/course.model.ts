export interface Course {
  id:string;
  url: string;
  status: 'draft' | 'published'
  title: string;
  subTitle:string;
  shortDescription: string;
  thumbnail: string;
}
