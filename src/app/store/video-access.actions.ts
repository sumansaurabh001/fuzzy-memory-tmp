import {Action} from '@ngrx/store';
import {VideoAccess} from '../models/video-access.model';



export enum VideoAccessActionTypes {

  SaveVideoAccess = "[REST API] Save Video Access"

};


export class SaveVideoAccess implements Action {
  readonly type = VideoAccessActionTypes.SaveVideoAccess;

  constructor(public payload: { videoAccess: VideoAccess }) {
  }
}


export type VideoAccessActions =
  SaveVideoAccess;
