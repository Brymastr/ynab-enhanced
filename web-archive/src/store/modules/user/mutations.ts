import { MutationTree } from 'vuex';
import { UserState, LoginStatus } from './types';

const mutations: MutationTree<UserState> = {
  setLoginStatus(state, status: LoginStatus) {
    state.loginStatus = status;
  },
  setSessionToken(state, sessionToken: string) {
    state.sessionToken = sessionToken;
  },
  setSessionExpiration(state, sessionExpiration: number) {
    state.sessionExpiration = sessionExpiration;
  },
  clear(state) {
    state.sessionToken = null;
    state.sessionExpiration = null;
    state.loginStatus = 'loggedOut';
  },
};

export default mutations;
