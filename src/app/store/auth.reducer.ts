import {AuthActions, AuthActionTypes} from './auth.actions';
import {User} from '../models/user.model';
import {UserPermissions} from '../models/user-permissions.model';


export interface AuthState {
  isLoggedIn:boolean;
  user: User;
  permissions?: UserPermissions;
}

export const initialAuthState: AuthState = {
  isLoggedIn: false,
  user:undefined,
  permissions: undefined
};

export function authReducer(state = initialAuthState, action: AuthActions): AuthState {
  switch (action.type) {
    case AuthActionTypes.LoginAction:
      return {
        ...state,
        isLoggedIn: true,
        user: action.user
      };

    case AuthActionTypes.SetUserPermissionsAction:
      return {
        ...state,
        permissions: action.permissions
      };

    case AuthActionTypes.LogoutAction:
      return {
        isLoggedIn: false,
        user: undefined,
        permissions: undefined
      };

    case AuthActionTypes.UserLoaded:
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
