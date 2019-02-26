import { Action } from '@ngrx/store';
import {User} from '../models/user.model';
import {UserPermissions} from '../models/user-permissions.model';
import {PricingPlan} from '../models/pricing-plan.model';
import {CourseActionTypes} from './course.actions';

export enum UserActionTypes {
  LoginAction = '[Firebase Auth] Login',
  UserLoaded = '[App Startup] User Loaded',
  LogoutAction = '[Top Menu] Logout',
  SetUserPermissionsAction = '[Firebase Auth] Set User Permissions',
  SubscriptionActivated = '[Subscriptions Page] Subscription Activated'
}

export class Login implements Action {
  readonly type = UserActionTypes.LoginAction;

  constructor(public user:User) {}
}

export class SetUserPermissions implements Action {
  readonly type = UserActionTypes.SetUserPermissionsAction;

  constructor(public permissions:UserPermissions) {}
}

export class Logout implements Action {
  readonly type = UserActionTypes.LogoutAction;
}

export class UserLoaded implements Action {
  readonly type = UserActionTypes.UserLoaded;

  constructor(public payload: {user:User}) {}

}

export class SubscriptionActivated implements Action {
  readonly type = UserActionTypes.SubscriptionActivated;

  constructor(public payload: {selectedPlan: PricingPlan}) {}
}

export type UserActions = Login | Logout | SetUserPermissions | UserLoaded | SubscriptionActivated;
