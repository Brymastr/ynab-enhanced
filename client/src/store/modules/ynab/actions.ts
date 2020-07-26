import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import { YnabState } from './types';
import { Account } from 'ynab';
import axios from 'axios';
import { getBudgets } from '@/services/ynab';

const client = axios.create();

const actions: ActionTree<YnabState, RootState> = {
  async getBudgets({ commit, state }) {
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
  async getAccounts({ commit, state }): Promise<Account[]> {
    const response = await client.get<Account[]>(`/api/budgets/${state.selectedBudgetId}/accounts`);

    commit('setAccounts', response.data);

    return response.data;
  },
  budgetSelected({ commit }, budgetId) {
    commit('setSelectedBudget', budgetId);
  },
  clear({ commit }) {
    commit('clear');
  },
};

export default actions;
