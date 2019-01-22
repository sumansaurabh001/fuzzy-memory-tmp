

export interface VideoAccess {

  id:string; // this corresponds to the lessonId

  status: 'allowed' | 'denied';

  videoSecretFileName:string;

}
