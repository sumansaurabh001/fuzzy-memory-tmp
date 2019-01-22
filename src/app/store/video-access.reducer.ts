import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {VideoAccess} from '../models/video-access.model';
import {VideoAccessActions, VideoAccessActionTypes} from './video-access.actions';




export interface VideoAccessState extends EntityState<VideoAccess> {

}

export const adapter: EntityAdapter<VideoAccess> = createEntityAdapter<VideoAccess>();



export const initialVideoAccessState: VideoAccessState = adapter.getInitialState({

});



export function videoAccessReducer(state = initialVideoAccessState, action: VideoAccessActions): VideoAccessState {

  switch (action.type) {

    case VideoAccessActionTypes.SaveVideoAccess:

      return adapter.addOne(action.payload.videoAccess, state);

    default:
      return state;
  }
}



export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();



