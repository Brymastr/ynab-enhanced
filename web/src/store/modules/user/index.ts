import { Module } from 'vuex';
import { UserState } from './types';
import { RootState } from '@/store/types';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';

const state: UserState = {
  loginStatus: 'loggedOut',
  sessionToken: null,
  sessionExpiration: null,
};

const user: Module<UserState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default user;
