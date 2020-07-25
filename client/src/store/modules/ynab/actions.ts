import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import { YnabState, Budget } from './types';
import axios from 'axios';

const apiUrl = 'http://localhost:3000';
const client = axios.create({ baseURL: apiUrl });

const actions: ActionTree<YnabState, RootState> = {
  async getBudgets({ commit, state, rootState }) {
    const response = await client.get<Budget[]>('/budgets');

    for (const remoteBudget of response.data) {
      const existingBudget = state.budgets.find(b => b.id === remoteBudget.id);
      if (existingBudget !== undefined) {
        const updatedBudget = Object.assign({}, existingBudget, remoteBudget);
        commit('createOrUpdateBudget', updatedBudget);
      } else {
        commit('createOrUpdateBudget', remoteBudget);
      }
    }
  },
  async getAccounts({ commit, state }): Promise<Account[]> {
    const response = await client.get<Account[]>(`/budgets/${state.selectedBudgetId}/accounts`);

    commit('setAccounts', response.data);

    return response.data;
  },
};

export default actions;
