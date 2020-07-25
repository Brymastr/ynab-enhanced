import { MutationTree } from 'vuex';
import { UserState, LoginStatus } from './types';

const mutations: MutationTree<UserState> = {
  setLoginStatus(state, status: LoginStatus) {
    state.loginStatus = status;
  },
  setSessionId(state, sessionId: string) {
    state.sessionId = sessionId;
  },
  clear(state) {
    state.sessionId = null;
    state.loginStatus = 'loggedOut';
  },
};

export default mutations;
