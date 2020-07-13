import { ActionTree } from 'vuex';
import { NetWorthState, WorthDate } from './types';
import { RootState } from '@/store/types';
import axios from 'axios';

const client = axios.create({ baseURL: 'http://localhost:3000' });

const BUDGET = '02927ecb-2530-4d23-972f-fb1c9ac96665';

const actions: ActionTree<NetWorthState, RootState> = {
  async getMonthlyNetWorth({ commit }): Promise<WorthDate[]> {
    const response = await client.get(`/budgets/${BUDGET}/monthlyNetWorth`);

    const data: WorthDate[] = response.data;

    commit('setMonthlyNetWorth', data);

    return data;
  },

  async getAccounts({ commit }): Promise<Account[]> {
    const response = await client.get(`/budgets/${BUDGET}/accounts`);

    const data: Account[] = response.data;

    commit('setAccounts', data);

    return data;
  },
};

export default actions;
