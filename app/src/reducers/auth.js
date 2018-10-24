import { USER_FETCHED, ACCESS_TOKEN_FETCHED, AUTH_COMPLETED_SUCCESS, AUTH_COMPLETED_FAIL, AUTH_STARTED, APP_LOADED } from '../actions/actionTypes';


export default (state = { user: {} }, action) => {
  switch (action.type) {
    case APP_LOADED:
      return {
        ...state,
        user: Object.assign({}, state.user),
      }
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