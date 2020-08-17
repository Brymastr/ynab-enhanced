import { Module } from 'vuex';
import { YnabState } from './types';
import { RootState } from '@/store/types';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';

const state: YnabState = {
  budgets: [],
  selectedBudgetId: null,
  selectedBudgetName: null,
  loadingAccountsStatus: 'ready',
  loadingBudgetsStatus: 'ready',
  loadingNetWorthStatus: 'ready',
  loadingForecastStatus: 'ready',
  budgetsUpdatedAt: null,
  accountsUpdatedAt: null,
  netWorthUpdatedAt: null,
  forecastUpdatedAt: null,
};

const ynab: Module<YnabState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default ynab;
