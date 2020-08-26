import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import { SettingsState } from './types';

const actions: ActionTree<SettingsState, RootState> = {
  settingsChanged({ commit }, settings: SettingsState) {
    commit('setSettings', settings);
  },
  clear({ commit }) {
    commit('clear');
  },
};

export default actions;
