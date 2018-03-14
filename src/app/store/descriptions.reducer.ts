import { Action } from '@ngrx/store';
import {DescriptionActions, DescriptionActionTypes} from './description.actions';


export interface State {

}

export const initialState: State = {

};

export function reducer(state = initialState, action: DescriptionActions): State {

  switch (action.type) {

    case DescriptionActionTypes.AddCourseDescription:

      const newState = {};
      newState[action.payload.courseId] = action.payload.description;

      return {...state, ...newState};

    default:
      return state;
  }
}
