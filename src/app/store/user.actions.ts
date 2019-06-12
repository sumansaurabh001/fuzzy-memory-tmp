import {Action, createAction, props} from '@ngrx/store';
import {User} from '../models/user.model';
import {UserPermissions} from '../models/user-permissions.model';
import {PricingPlan} from '../models/pricing-plan.model';
import * as firebase from 'firebase/app';



export const login = createAction(
  '[Firebase Auth] Login',
  props<User>()
);

export const setUserPermissions = createAction(
  '[Firebase Auth] Set User Permissions',
  props<UserPermissions>()
);

export const logout = createAction(
  '[Top Menu] Logout'
);


export const userLoaded = createAction(
  '[App Startup] User Loaded',
  props<{user:Partial<User>}>()
);

export const planActivated = createAction(
  '[Subscriptions Page] Plan Activated',
  props<{selectedPlan: string, user: Partial<User>}>()
);

export const planCancelled = createAction(
  '[My Account Screen] Plan Cancelled',
  props<{planEndsAt:firebase.firestore.Timestamp}>()
);
