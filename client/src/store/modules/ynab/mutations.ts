import { MutationTree } from 'vuex';
import { YnabState, Budget } from './types';

const mutations: MutationTree<YnabState> = {
  createOrUpdateBudget(state, budget: Budget) {
    const index = state.budgets.findIndex(b => b.id === budget.id);

    if (index !== -1) state.budgets.splice(index, 1);

    state.budgets.push(budget);
  },
};

export default mutations;
