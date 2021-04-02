import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import { UserState } from './types';
import router from '../../../router';

const actions: ActionTree<UserState, RootState> = {
  ynabLogin({ commit }) {
    // event.preventDefault();
    const uri = `${process.env.VUE_APP_API}/auth/ynab/login`;
    commit('setLoginStatus', 'pending');
    location.replace(uri);
  },
  login({ commit }, session: { token: string; expiration: number }) {
    commit('setSessionToken', session.token);
    commit('setSessionExpiration', session.expiration);
    commit('setLoginStatus', 'loggedIn');
  },
  logout({ commit, dispatch }) {
    commit('clear');
    dispatch('ynab/clear', null, { root: true });
    dispatch('settings/clear', null, { root: true });
    router.push({ name: 'Login' });
  },
};

export default actions;
