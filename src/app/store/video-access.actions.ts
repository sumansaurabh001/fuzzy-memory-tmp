import {createAction, props} from '@ngrx/store';
import {VideoAccess} from '../models/video-access.model';




export const saveVideoAccess = createAction(
  "[REST API] Save Video Access",
  props<{ videoAccess: VideoAccess }>()
);

export const courseReset = createAction(
  "[Video Access Effect] Course Reset",
  props<{courseId:string}>()
);


