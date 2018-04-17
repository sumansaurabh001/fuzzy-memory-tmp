import { Action } from '@ngrx/store';
import {AuthActions, AuthActionTypes} from './auth.actions';
import {User} from '../models/user.model';


export interface AuthState {
  isLoggedIn:boolean;
  user: User;
}

export const initialAuthState: AuthState = {
  isLoggedIn: false,
  user:undefined
};

export function authReducer(state = initialAuthState, action: AuthActions): AuthState {
  switch (action.type) {
    case AuthActionTypes.LoginAction:
      return {
        isLoggedIn: true,
        user: action.user
      };
    case AuthActionTypes.LogoutAction:
      return {
        isLoggedIn: false,
        user: undefined
      };

    default:
      return state;
  }
}
