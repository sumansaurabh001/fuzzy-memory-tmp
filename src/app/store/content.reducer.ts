import {ContentActions, ContentActionTypes} from './content.actions';
import {SubscriptionContent} from '../models/content/subscription-content.model';
import {HomePageContent} from '../models/content/home-page-content.model';


export interface ContentState {
  subscription: {
    content:SubscriptionContent;
    loaded:boolean;
  },
  homePage: {
    content: HomePageContent,
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
  },
  homePage: {
    content: {
      benefits: []
    },
    loaded: false
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
          content: action.payload.content
        }
      };

    case ContentActionTypes.HomePageContentLoaded:
    case ContentActionTypes.HomePageContentUpated:
      return {
        ...state,
        homePage: {
          loaded:true,
          content: action.payload.content
        }
      };



    default:
      return state;
  }
}
