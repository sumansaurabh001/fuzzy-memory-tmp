import {createFeatureSelector, createSelector} from '@ngrx/store';
import {ContentState} from './content.reducer';


export const selectContentState = createFeatureSelector<ContentState>('content');


export const isContentLoaded = (contentKey:string) => createSelector(
  selectContentState,
  contentState => contentState[contentKey].loaded
);


export const selectContent = (contentKey:string) => createSelector(
  selectContentState,
  contentState => contentState[contentKey].content
);


