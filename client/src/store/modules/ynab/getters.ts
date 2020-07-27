import { GetterTree } from 'vuex';
import { YnabState } from './types';
import { RootState } from '@/store/types';

const getters: GetterTree<YnabState, RootState> = {
  getMonthlyNetWorth(state) {
    return function(budgetId: string) {
      const budget = state.budgets.find(budget => budget.id === budgetId);
      if (!budget) return null;
      return budget.monthlyNetWorth;
    };
  },
};

export default getters;
