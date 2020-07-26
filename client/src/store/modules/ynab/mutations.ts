import { MutationTree } from 'vuex';
import { YnabState, Budget } from './types';

const mutations: MutationTree<YnabState> = {
  createOrUpdateBudget(state, budget: Budget) {
    const index = state.budgets.findIndex(b => b.id === budget.id);

    if (index !== -1) state.budgets.splice(index, 1);

    state.budgets.push(budget);
  },
  setSelectedBudget(state, budgetId: string) {
    state.selectedBudgetId = budgetId;
  },
  setLoadingBudgets(state, status) {
    state.loadingBudgetsStatus = status;
  },
  setLoadingAccounts(state, status) {
    state.loadingAccountsStatus = status;
  },
  setLoadingNetWorth(state, status) {
    state.loadingNetWorthStatus = status;
  },
  clear(state) {
    state.budgets.length = 0;
    state.selectedBudgetId = null;
    state.loadingAccountsStatus = 'ready';
    state.loadingBudgetsStatus = 'ready';
    state.loadingNetWorthStatus = 'ready';
  },
};

export default mutations;
