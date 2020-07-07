import { ActionTree } from 'vuex';
import { NetWorthState, MonthlyNetWorth } from './types';
import { RootState } from '@/store/types';
import axios from 'axios';

const client = axios.create({ baseURL: 'http://localhost:3000' });

const actions: ActionTree<NetWorthState, RootState> = {
  async getMonthlyNetWorth({ commit }): Promise<MonthlyNetWorth> {
    const response = await client.get(
      '/budgets/02927ecb-2530-4d23-972f-fb1c9ac96665/monthlyNetWorth',
    );

    const data: MonthlyNetWorth = response.data;

    commit('setMonthlyNetWorth', data);

    return data;
  },

  async getAccounts({ commit }): Promise<Account[]> {
    const response = await client.get('/budgets/02927ecb-2530-4d23-972f-fb1c9ac96665/accounts');

    const data: Account[] = response.data;

    commit('setAccounts', data);

    return data;
  },
};

export default actions;
