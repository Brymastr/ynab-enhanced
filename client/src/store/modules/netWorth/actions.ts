import { ActionTree } from 'vuex';
import { NetWorthState, WorthDate } from './types';
import { RootState } from '@/store/types';
import axios from 'axios';

const client = axios.create({ baseURL: 'http://localhost:3000' });

const actions: ActionTree<NetWorthState, RootState> = {
  async getMonthlyNetWorth({ commit, rootState }): Promise<WorthDate[]> {
    const selectedBudgetId = rootState.ynab.selectedBudgetId;

    const response = await client.get(`/budgets/${selectedBudgetId}/monthlyNetWorth`);

    const data: WorthDate[] = response.data;

    commit('setMonthlyNetWorth', data);

    return data;
  },
};

export default actions;
