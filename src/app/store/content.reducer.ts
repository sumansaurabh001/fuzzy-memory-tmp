import {ContentActions, ContentActionTypes} from './content.actions';
import {SubscriptionContent} from '../models/content/subscription-content.model';


export interface ContentState {
  subscription: {
    content:SubscriptionContent;
    loaded:boolean;
  }

}


export const initialContentState:ContentState = {
  subscription: {
    loaded:false,
    content: {
      subscriptionBenefits: undefined,
      faqs: []
    }
  }
};


export function contentReducer(state =initialContentState, action: ContentActions) : ContentState {
  switch (action.type) {
    case ContentActionTypes.SubscriptionContentLoaded:
    case ContentActionTypes.SubscriptionContentUpdated:
      return {
        ...state,
        subscription: {
          loaded:true,
          content: action.payload.subscriptionContent
        }
      };


    default:
      return state;
  }
}
