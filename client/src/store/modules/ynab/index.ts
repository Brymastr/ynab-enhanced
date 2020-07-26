import { Module } from 'vuex';
import { YnabState } from './types';
import { RootState } from '@/store/types';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';

const state: YnabState = {
  budgets: [],
  selectedBudgetId: null,
  loadingAccountsStatus: 'ready',
  loadingBudgetsStatus: 'ready',
  loadingNetWorthStatus: 'ready',
};

const ynab: Module<YnabState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default ynab;
