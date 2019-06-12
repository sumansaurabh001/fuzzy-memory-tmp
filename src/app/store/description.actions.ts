import {createAction, props} from '@ngrx/store';

export type Description = {id:string, description:string};


export const saveDescription = createAction(
  '[Description] Save  Description',
  props<Description>()
);


export const loadDescription = createAction(
  '[Description] Load Description',
  props<{descriptionId: string}>()
);

export const addDescription = createAction(
  '[Description] Add Course Description',
  props<Description>()
);


