import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import { YnabState } from './types';
import { getBudgets, getAccounts, getMonthlyNetWorth } from '@/services/ynab';

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
    const budgetId = state.selectedBudgetId;

    if (!budgetId) return null;

    const monthlyNetWorth = await getMonthlyNetWorth(budgetId);

    const budget = state.budgets.find(b => b.id === budgetId);

    const updatedBudget = Object.assign({}, budget, { monthlyNetWorth });

    commit('createOrUpdateBudget', updatedBudget);
  },
  budgetSelected({ commit }, budgetId) {
    commit('setSelectedBudget', budgetId);
  },
  clear({ commit }) {
    commit('clear');
  },
};

export default actions;
