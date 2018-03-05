export interface Course {
  id:string;
  title: string;
  thumbnailUrl: string;
  shortDescription: string;
  url: string;
  status: 'draft' | 'published'
}
