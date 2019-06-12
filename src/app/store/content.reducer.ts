
import {SubscriptionContent} from '../models/content/subscription-content.model';
import {HomePageContent} from '../models/content/home-page-content.model';
import {createReducer, on} from '@ngrx/store';
import {ContentActions} from './action-types';


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


export const contentReducer = createReducer(
  initialContentState,

  on(
    ContentActions.subscriptionContentLoaded,
    ContentActions.subscriptionContentUpdated,
    (state, {content}) => {
      return {
        ...state,
        subscription: {
          loaded:true,
          content
        }
      };
    }
  ),

  on(
    ContentActions.homePageContentLoaded,
    ContentActions.homePageContentUpdated,
    (state, {content}) => {
      return {
        ...state,
        homePage: {
          loaded:true,
          content
        }
      };
    }
  )

);


