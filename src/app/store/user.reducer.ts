import {ANONYMOUS_USER, User} from '../models/user.model';
import {UserPermissions} from '../models/user-permissions.model';
import {createReducer, on} from '@ngrx/store';
import {UserActions} from './action-types';


export interface UserState {
  isLoggedIn:boolean;
  user: User;
  permissions?: UserPermissions;
}

const DEFAULT_PERMISSIONS: UserPermissions = {
  isAdmin: false
};

export const initialUserState: UserState = {
  isLoggedIn: false,
  user:ANONYMOUS_USER,
  permissions: DEFAULT_PERMISSIONS
};


export const userReducer = createReducer(

  initialUserState,

  on(UserActions.login, (state,user) => {
    return {
      ...state,
      isLoggedIn: true,
      user
    };
  }),

  on(UserActions.setUserPermissions, (state,permissions) => {
    return {
      ...state,
      permissions
    };
  }),

  on(UserActions.logout, (state,action) => {
    return {
      isLoggedIn: false,
      user: ANONYMOUS_USER,
      permissions:DEFAULT_PERMISSIONS
    };
  }),

  on(UserActions.userLoaded, (state,action) => {
    return {
      ...state,
      user: {
        ...state.user,
        ...action.user
      }
    };
  }),

  on(UserActions.planActivated, (state,action) => {
    return {
      ...state,
      user: {
        ...state.user,
        ...action.user,
        pricingPlan: action.selectedPlan
      }
    };
  }),

  on(UserActions.planCancelled, (state,action) => {
    return {
      ...state,
      user: {
        ...state.user,
        planEndsAt: action.planEndsAt
      }
    };
  }),

);


