import { Action } from '@ngrx/store';
import {User} from '../models/user.model';
import {UserPermissions} from '../models/user-permissions.model';

export enum AuthActionTypes {
  LoginAction = '[Firebase Auth] Login',
  LogoutAction = '[Top Menu] Logout',
  SetUserPermissionsAction = '[Firebase Auth] Set User Permissions'
}

export class Login implements Action {
  readonly type = AuthActionTypes.LoginAction;

  constructor(public user:User) {}
}

export class SetUserPermissions implements Action {
  readonly type = AuthActionTypes.SetUserPermissionsAction;

  constructor(public permissions:UserPermissions) {}
}

export class Logout implements Action {
  readonly type = AuthActionTypes.LogoutAction;
}


export type AuthActions = Login | Logout | SetUserPermissions;
