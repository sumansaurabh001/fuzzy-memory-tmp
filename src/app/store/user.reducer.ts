import {UserActions, UserActionTypes} from './user.actions';
import {User} from '../models/user.model';
import {UserPermissions} from '../models/user-permissions.model';


export interface UserState {
  isLoggedIn:boolean;
  user: User;
  permissions?: UserPermissions;
}

export const initialUserState: UserState = {
  isLoggedIn: false,
  user:undefined,
  permissions: undefined
};

export function userReducer(state = initialUserState, action: UserActions): UserState {
  switch (action.type) {
    case UserActionTypes.LoginAction:
      return {
        ...state,
        isLoggedIn: true,
        user: action.user
      };

    case UserActionTypes.SetUserPermissionsAction:
      return {
        ...state,
        permissions: action.permissions
      };

    case UserActionTypes.LogoutAction:
      return {
        isLoggedIn: false,
        user: undefined,
        permissions: undefined
      };

    case UserActionTypes.UserLoaded:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload.user
        }
      };

    case UserActionTypes.PlanActivated:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload.user,
          pricingPlan: action.payload.selectedPlan.frequency
        }
      };

    case UserActionTypes.PlanCancelled:
      return {
        ...state,
        user: {
          ...state.user,
          planEndsAt: action.payload.planEndsAt
        }
      };

    default:
      return state;
  }
}
