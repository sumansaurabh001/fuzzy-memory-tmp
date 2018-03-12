

export interface Lesson {
   id:string;
   status: 'draft' | 'published';
   seqNo:string;
   title:string;
   fileName:string;
   duration:number;
   free: boolean;
}
