import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import { YnabState, Budget } from './types';
import { getBudgets, getAccounts, getMonthlyNetWorth } from '@/services/ynab';
import moment from 'moment';

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
  },
  async loadMonthlyNetWorth({ commit, state }) {
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
      moment()
        .endOf('month')
        .format('YYYY-MM-DD');

    const updatedBudget = Object.assign({}, budget, {
      monthlyNetWorth,
      selectedStartDate,
      selectedEndDate,
    });

    commit('createOrUpdateBudget', updatedBudget);

    commit('setLoadingNetWorth', 'complete');
  },
  setBudgetStartDate({ commit }, budget: Budget) {
    commit('setBudgetStartDate', budget);
  },
  setBudgetEndDate({ commit }, budget: Budget) {
    commit('setBudgetEndDate', budget);
  },
  budgetSelected({ commit }, budget: Budget) {
    commit('setSelectedBudget', budget);
  },
  clear({ commit }) {
    commit('clear');
  },
};

export default actions;
