import { Action } from '@ngrx/store';

export enum DescriptionActionTypes {
  LoadDescription = '[Description] Load  Description',
  SaveDescription = '[Description] Save  Description',
  AddDescription = '[Description] Add Course Description'
}

export type Description = {id:string, description:string};


export class SaveDescription implements Action {

  readonly type = DescriptionActionTypes.SaveDescription;

  constructor(public payload: Description) {

  }
}

export class LoadDescription implements Action {

  readonly type = DescriptionActionTypes.LoadDescription;

  constructor(public payload: {id:string}) {

  }
}

export class AddDescription implements Action {

  readonly type = DescriptionActionTypes.AddDescription;

  constructor(public payload: Description) {

  }
}


export type DescriptionActions = LoadDescription | AddDescription | SaveDescription;


