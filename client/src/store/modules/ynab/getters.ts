import { GetterTree } from 'vuex';
import { YnabState } from './types';
import { RootState } from '@/store/types';

const getters: GetterTree<YnabState, RootState> = {
  getBudgetById(state) {
    return function(budgetId?: string) {
      const id = budgetId ?? state.selectedBudgetId;
      return state.budgets.find(budget => budget.id === id);
    };
  },
  getMonthlyNetWorth(state) {
    return function(budgetId?: string) {
      const id = budgetId ?? state.selectedBudgetId;
      const budget = state.budgets.find(budget => budget.id === id);
      if (!budget) return null;
      return budget.monthlyNetWorth;
    };
  },
  getSelectedStartDate(state) {
    return function(budgetId?: string) {
      const id = budgetId ?? state.selectedBudgetId;
      const budget = state.budgets.find(budget => budget.id === id);
      if (!budget) return null;
      return budget.selectedStartDate;
    };
  },
  getSelectedEndDate(state) {
    return function(budgetId?: string) {
      const id = budgetId ?? state.selectedBudgetId;
      const budget = state.budgets.find(budget => budget.id === id);
      if (!budget) return null;
      return budget.selectedEndDate;
    };
  },
};

export default getters;
