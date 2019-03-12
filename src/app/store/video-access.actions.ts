import {Action} from '@ngrx/store';
import {VideoAccess} from '../models/video-access.model';



export enum VideoAccessActionTypes {

  SaveVideoAccess = "[REST API] Save Video Access",
  CourseReset = "[Video Access Effect] Course Reset"

};


export class SaveVideoAccess implements Action {
  readonly type = VideoAccessActionTypes.SaveVideoAccess;

  constructor(public payload: { videoAccess: VideoAccess }) {
  }
}


export class CourseReset implements Action {

  readonly type = VideoAccessActionTypes.CourseReset;

  constructor(public payload: {courseId:string}) {}

}


export type VideoAccessActions =
  SaveVideoAccess;
