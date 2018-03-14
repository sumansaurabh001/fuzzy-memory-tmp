
import {DescriptionActions, DescriptionActionTypes} from './description.actions';


export interface State {

}

export const initialState: State = {

};


export function reducer(state = initialState, action: DescriptionActions): State {

  switch (action.type) {

    case DescriptionActionTypes.SaveDescription:
    case DescriptionActionTypes.AddDescription:  {

      const newState = {};
      newState[action.payload.id] = action.payload.description;

      return {...state, ...newState};
    }

    default:
      return state;
  }
}
