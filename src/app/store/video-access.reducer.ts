import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {VideoAccess} from '../models/video-access.model';
import {VideoAccessActions, VideoAccessActionTypes} from './video-access.actions';
import {CourseActions, CourseActionTypes} from './course.actions';




export interface VideoAccessState extends EntityState<VideoAccess> {

}

export const adapter: EntityAdapter<VideoAccess> = createEntityAdapter<VideoAccess>();



export const initialVideoAccessState: VideoAccessState = adapter.getInitialState({

});



export function videoAccessReducer(state = initialVideoAccessState, action: VideoAccessActions | CourseActions): VideoAccessState {

  switch (action.type) {

    case VideoAccessActionTypes.SaveVideoAccess:

      return adapter.addOne(action.payload.videoAccess, state);

    case CourseActionTypes.CoursePurchased:

      const allVideos = Object.values(state.entities),
            courseVideos = allVideos.filter(video => video.courseId == action.payload.courseId),
            courseVideoKeys = courseVideos.map(video => video.id);

      return adapter.removeMany(courseVideoKeys, state);


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



