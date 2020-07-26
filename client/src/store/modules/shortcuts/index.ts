import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import { Module } from 'vuex';

interface ShortcutsState {
  [key: string]: any;
}

const actions: ActionTree<ShortcutsState, RootState> = {
  resetTyped({ dispatch }) {
    dispatch('user/logout', null, { root: true });
    dispatch('ynab/clear', null, { root: true });
  },
};

const shortcuts: Module<ShortcutsState, RootState> = {
  namespaced: true,
  actions,
};

export default shortcuts;
