import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import { YnabState, Budget, WorthDate } from './types';
import { getBudgets, getAccounts, getMonthlyNetWorth, getForecast } from '@/services/ynab';
import moment from 'moment';
import numeral from 'numeral';

const actions: ActionTree<YnabState, RootState> = {
  async loadBudgets({ commit, state }) {
    commit('setLoadingBudgets', 'loading');
    const remoteBudgets = await getBudgets();

    for (const remoteBudget of remoteBudgets) {
      const existingBudget = state.budgets.find(b => b.id === remoteBudget.id);
      if (existingBudget !== undefined) {
        const updatedBudget = Object.assign({}, existingBudget, remoteBudget);
        commit('createOrUpdateBudget', updatedBudget);
      } else {
        commit('createOrUpdateBudget', remoteBudget);
      }
    }

    commit('setLoadingBudgets', 'complete');

    commit('setBudgetsUpdatedAt', moment().format('X'));

    setTimeout(() => commit('setLoadingBudgets', 'ready'), 2000);
  },
  async loadAccounts({ commit, state }) {
    commit('setLoadingAccounts', 'loading');
    const budgetId = state.selectedBudgetId;

    if (!budgetId) return null;

    const remoteAccounts = await getAccounts(budgetId);

    const accountsPayload = { budgetId, accounts: remoteAccounts };

    commit('createOrUpdateAccounts', accountsPayload);

    commit('setLoadingAccounts', 'complete');

    commit('setAccountsUpdatedAt', moment().format('X'));

    setTimeout(() => commit('setLoadingAccounts', 'ready'), 2000);
  },
  async loadNetWorth({ commit, state }) {
    commit('setLoadingNetWorth', 'loading');

    const budgetId = state.selectedBudgetId;

    if (!budgetId) return null;

    const monthlyNetWorth = await getMonthlyNetWorth(budgetId);

    const budget = state.budgets.find(b => b.id === budgetId);
    if (!budget) return;

    const selectedStartDate =
      budget.selectedStartDate ??
      moment(budget.first_month)
        .endOf('month')
        .format('YYYY-MM-DD');
    const selectedEndDate =
      budget.selectedEndDate ??
      moment(monthlyNetWorth[monthlyNetWorth.length - 1].date)
        .endOf('month')
        .format('YYYY-MM-DD');

    const updatedBudget = Object.assign({}, budget, {
      monthlyNetWorth,
      selectedStartDate,
      selectedEndDate,
    });

    commit('createOrUpdateBudget', updatedBudget);

    commit('setLoadingNetWorth', 'complete');

    commit('setNetWorthUpdatedAt', moment().format('X'));

    setTimeout(() => commit('setLoadingNetWorth', 'ready'), 2000);
  },
  async loadForecast({ commit, state }) {
    commit('setLoadingForecast', 'loading');

    const budgetId = state.selectedBudgetId;

    if (!budgetId) return null;

    const forecast = await getForecast(budgetId);

    const budget = state.budgets.find(b => b.id === budgetId);
    if (!budget) return;

    const updatedBudget = Object.assign({}, budget, { forecast });

    commit('createOrUpdateBudget', updatedBudget);

    commit('setLoadingForecast', 'complete');

    commit('setForecastUpdatedAt', moment().format('X'));

    setTimeout(() => commit('setLoadingForecast', 'ready'), 2000);
  },
  loadMonthlyData({ dispatch }) {
    dispatch('loadNetWorth');
    dispatch('loadForecast');
  },
  setBudgetStartDate({ commit }, budget: Budget) {
    commit('setBudgetStartDate', budget);
  },
  setBudgetEndDate({ commit }, budget: Budget) {
    commit('setBudgetEndDate', budget);
  },
  budgetSelected({ commit, getters, dispatch, state }, budget: Budget) {
    if (budget.id === state.selectedBudgetId) return;
    commit('setSelectedBudget', budget);

    numeral.locale(budget.currency_format?.iso_code);
    const netWorth = getters.getNetWorth(budget.id);
    if (!netWorth) {
      dispatch('loadNetWorth');
      dispatch('loadForecast');
    }
  },
  createDateList({ commit, getters }, budgetId: string) {
    const netWorth = getters.getNetWorth().map((x: WorthDate) => x.date);
    const forecast = getters.getForecast().map((x: WorthDate) => x.date);
    const combined = netWorth.concat(forecast);
    commit('setDateList', { id: budgetId, dateList: combined });
  },
  clear({ commit }) {
    commit('clear');
  },
};

export default actions;
