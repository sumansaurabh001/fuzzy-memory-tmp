import {createFeatureSelector, createSelector} from '@ngrx/store';
import {ContentState} from './content.reducer';


export const selectContentState = createFeatureSelector<ContentState>('content');


export const isSubscriptionContentLoaded = createSelector(
  selectContentState,
  contentState => contentState.subscription.loaded
);


export const selectSubscriptionContent = createSelector(
  selectContentState,
  contentState => contentState.subscription.content
);
