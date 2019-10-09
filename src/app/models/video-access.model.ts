

export interface VideoAccess {

  id:string; // this corresponds to the lessonId

  courseId:string;

  status: 'allowed' | 'denied';

  secretVideoName:string;

}
