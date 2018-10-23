import { USER_FETCHED } from '../actions/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case USER_FETCHED:
      return {
        ...state,
        user: Object.assign({}, state.user, action.payload),
      };
    default:
      return state;
  }
};