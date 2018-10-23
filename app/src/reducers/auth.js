import { USER_FETCHED, ACCESS_TOKEN_FETCHED, AUTH_COMPLETED_SUCCESS, AUTH_COMPLETED_FAIL, AUTH_STARTED } from '../actions/actionTypes';


export default (state = {}, action) => {
  switch (action.type) {
    case AUTH_STARTED:
      return {
        ...state,
        authenticating: true,
      };
    case AUTH_COMPLETED_SUCCESS:
      return {
        ...state,
        authenticating: false,
      };
    case AUTH_COMPLETED_FAIL:
      return {
        ...state,
        authenticating: false,
        user: null
      };
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