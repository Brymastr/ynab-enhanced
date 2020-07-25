import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import axios from 'axios';
import { UserState } from './types';
import router from '../../../router';

const apiUrl = 'http://localhost:3000';
const client = axios.create({ baseURL: apiUrl });

interface LoginPayload {
  session_id: string;
  selected_budget_id: string;
}

const actions: ActionTree<UserState, RootState> = {
  ynabLogin({ commit }, event: MouseEvent) {
    event.preventDefault();
    const uri = `${apiUrl}/login`;
    commit('setLoginStatus', 'pending');
    location.replace(uri);
  },
  login({ commit }, sessionId: string) {
    commit('setSessionId', sessionId);
    commit('setLoginStatus', 'loggedIn');
    router.push({ name: 'Main' });
  },
  logout({ commit }) {
    commit('clear');
  },
};

export default actions;
