import {Action} from '@ngrx/store';
import {SubscriptionContent} from '../models/content/subscription-content.model';
import {HomePageContent} from '../models/content/home-page-content.model';


export enum ContentActionTypes {
  GetSubscriptionContent = '[Subscription Screen] Get Subscription Content',
  SubscriptionContentLoaded = '[Content Effects] Subscription Content Loaded',
  SubscriptionContentUpdated = '[Subscription Screen] Subscription Content Updated',
  GetHomePageContent = '[Home Page] Get Home Page Content',
  HomePageContentLoaded = '[Content Effects] Home Page Content Loaded',
  HomePageContentUpated = '[Home Page Content] Home Page Content Updated'
}


export class GetSubscriptionContent implements Action {

  readonly type = ContentActionTypes.GetSubscriptionContent;

}

export class SubscriptionContentLoaded implements Action {

  readonly type = ContentActionTypes.SubscriptionContentLoaded;

  constructor(public payload: {content:SubscriptionContent}) {}

}

export class SubscriptionContentUpdated implements Action {

  readonly type = ContentActionTypes.SubscriptionContentUpdated;

  constructor(public payload: {content:SubscriptionContent}) {}

}

export class GetHomePageContent implements Action {

  readonly type = ContentActionTypes.GetHomePageContent;

}

export class HomePageContentLoaded implements Action {


  readonly type = ContentActionTypes.HomePageContentLoaded;

  constructor(public payload: {content: HomePageContent}) {}

}

export class HomePageContentUpdated implements Action {

  readonly type = ContentActionTypes.HomePageContentUpated;

  constructor(public payload: {content: HomePageContent}) {}

}



export type ContentActions =
    GetSubscriptionContent
  | SubscriptionContentLoaded
  | SubscriptionContentUpdated
  | GetHomePageContent
  | HomePageContentLoaded
  | HomePageContentUpdated;


