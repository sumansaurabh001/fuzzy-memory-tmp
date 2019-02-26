import {UserActions, UserActionTypes} from './auth.actions';
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
          pricingPlan: action.payload.user.pricingPlan
        }
      }

    default:
      return state;
  }
}
