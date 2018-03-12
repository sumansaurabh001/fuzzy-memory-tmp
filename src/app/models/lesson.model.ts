

export interface Lesson {
   id:string;
   status: 'draft' | 'published';
   sectionId:string;
   seqNo:string;
   title:string;
   fileName:string;
   duration:number;
   free: boolean;
}
