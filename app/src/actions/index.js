import { USER_FETCHED } from './actionTypes';

export const setUser = user => ({
  type: USER_FETCHED,
  user
});