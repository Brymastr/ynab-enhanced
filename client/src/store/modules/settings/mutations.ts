import { MutationTree, Mutation } from 'vuex';
import { SettingsState } from './types';
import { state as defaultState } from './types';

const mutations: MutationTree<SettingsState> = {
  setSettings(state, settings) {
    state.settings = settings.settings;
  },
  clear(state) {
    state = defaultState;
  },
};

export default mutations;
