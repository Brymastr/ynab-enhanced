import { GetterTree } from 'vuex';
import { SettingsState } from './types';
import { RootState } from '@/store/types';

const getters: GetterTree<SettingsState, RootState> = {
  getSetting(state) {
    return function(setting?: string) {
      return '';
    };
  },
};

export default getters;
