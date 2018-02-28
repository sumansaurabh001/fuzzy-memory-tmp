export interface Course {
  id:string;
  title: string;
  cardImageUrl: string;
  shortDescription: string;
  url: string;
  status: 'draft' | 'published'
}
