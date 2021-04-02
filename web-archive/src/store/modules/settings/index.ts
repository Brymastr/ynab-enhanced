import { Module } from 'vuex';
import { state, SettingsState } from './types';
import { RootState } from '@/store/types';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';

const settings: Module<SettingsState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default settings;
