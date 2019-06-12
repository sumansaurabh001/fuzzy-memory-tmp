import {createReducer, on} from '@ngrx/store';
import {DescriptionActions} from './action-types';


export interface State {

}

export const initialState: State = {

};

export const descriptionsReducer = createReducer(
  initialState,

  on(
    DescriptionActions.saveDescription,
    DescriptionActions.addDescription,
    (state, action) => {
      const newState = {};
      newState[action.id] = action.description;

      return {...state, ...newState};
    })
);



