import {Action} from '@ngrx/store';
import {SubscriptionContent} from '../models/content/subscription-content.model';


export enum ContentActionTypes {
  GetSubscriptionContent = '[Subscription Screen] Get Subscription Content',
  SubscriptionContentLoaded = '[Content Effects] Subscription Content Loaded',
  SubscriptionContentUpdated = '[Subscription Screen] Subscription Content Updated'
}


export class GetSubscriptionContent implements Action {

  readonly type = ContentActionTypes.GetSubscriptionContent;

}

export class SubscriptionContentLoaded implements Action {

  readonly type = ContentActionTypes.SubscriptionContentLoaded;

  constructor(public payload: {subscriptionContent:SubscriptionContent}) {}

}

export class SubscriptionContentUpdated implements Action {

  readonly type = ContentActionTypes.SubscriptionContentUpdated;

  constructor(public payload: {subscriptionContent:SubscriptionContent}) {}

}

export type ContentActions =
    GetSubscriptionContent
  | SubscriptionContentLoaded
  | SubscriptionContentUpdated;


