import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {VideoAccess} from '../models/video-access.model';
import {createReducer, on} from '@ngrx/store';
import {UserActions, VideoAccessActions} from './action-types';


export interface VideoAccessState extends EntityState<VideoAccess> {

}

export const adapter: EntityAdapter<VideoAccess> = createEntityAdapter<VideoAccess>();



export const initialVideoAccessState: VideoAccessState = adapter.getInitialState();


export const videoAccessReducer = createReducer(
  initialVideoAccessState,

  on(VideoAccessActions.saveVideoAccess, (state, action) => adapter.addOne(action.videoAccess, state)),

  on(VideoAccessActions.courseReset, (state, action) =>  {

    const allVideos = Object.values(state.entities),
      courseVideos = allVideos.filter(video => video.courseId == action.courseId),
      courseVideoKeys = courseVideos.map(video => video.id);

    return adapter.removeMany(courseVideoKeys, state);
  }),

  on(UserActions.planActivated, state => adapter.removeAll(state))

);





export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();



