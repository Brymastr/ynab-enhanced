import { USER_FETCHED, ACCESS_TOKEN_FETCHED } from '../actions/actionTypes';


export default (state = {}, action) => {
  switch (action.type) {
    case ACCESS_TOKEN_FETCHED:
      return {
        ...state,
        token: action.token,
      };
    case USER_FETCHED:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};