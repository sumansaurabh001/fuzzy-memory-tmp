import {Action, createAction, props} from '@ngrx/store';
import {SubscriptionContent} from '../models/content/subscription-content.model';
import {HomePageContent} from '../models/content/home-page-content.model';


export const getSubscriptionContent = createAction(
  '[Subscription Screen] Get Subscription Content'
);

export const subscriptionContentLoaded = createAction(
  '[Content Effects] Subscription Content Loaded',
  props<{content:SubscriptionContent}>()
);

export const subscriptionContentUpdated = createAction(
  '[Subscription Screen] Subscription Content Updated',
  props<{content:SubscriptionContent}>()
);

export const getHomePageContent = createAction(
  '[Home Page] Get Home Page Content'
);


export const homePageContentLoaded = createAction(
  '[Content Effects] Home Page Content Loaded',
  props<{content: HomePageContent}>()
);

export const homePageContentUpdated = createAction(
  '[Home Page Content] Home Page Content Updated',
  props<{content: HomePageContent}>()
);


