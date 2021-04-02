import { MutationTree } from 'vuex';
import { SettingsState } from './types';
import { state as defaultState } from './types';

const mutations: MutationTree<SettingsState> = {
  setSettings(state, settings) {
    state.settings = settings.settings;
  },
  clear(state) {
    state.settings = defaultState.settings;
  },
};

export default mutations;
