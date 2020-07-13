import { MutationTree } from 'vuex';
import { NetWorthState, WorthDate, Account } from './types';

const mutations: MutationTree<NetWorthState> = {
  setMonthlyNetWorth(state, netWorth: WorthDate[]) {
    state.monthlyNetWorth.length = 0;
    state.monthlyNetWorth.push(...netWorth);
  },
  setAccounts(state, accounts: Account[]) {
    for (const account of accounts) {
      const existingAccount = state.accounts.find(x => x.id === account.id);

      if (existingAccount) {
        const existingAccountIndex = state.accounts.findIndex(x => x.id === account.id);
        const existingMonths = existingAccount.months;
        state.accounts.splice(existingAccountIndex, 1);
        if (existingMonths) account.months = existingMonths;
      }

      state.accounts.push(account);
    }
  },
};

export default mutations;
