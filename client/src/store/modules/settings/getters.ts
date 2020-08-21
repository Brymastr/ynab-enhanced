import { GetterTree } from 'vuex';
import { SettingsState } from './types';
import { RootState } from '@/store/types';

const getters: GetterTree<SettingsState, RootState> = {
  // getSetting() {
  //   return function(setting?: string) {
  //     return '';
  //   };
  // },
};

export default getters;
