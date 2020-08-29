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
  getMonthlyNetWorth(state, getters) {
    return function(budgetId?: string) {
      const budget = getters.getBudgetById(budgetId);
      if (!budget) return null;
      return budget.monthlyNetWorth;
    };
  },
  getMonthlyForecast(state, getters) {
    return function(budgetId?: string) {
      const budget = getters.getBudgetById(budgetId);
      if (!budget) return null;
      return budget.forecast;
    };
  },
  getSelectedStartDate(state, getters) {
    return function(budgetId?: string) {
      const budget = getters.getBudgetById(budgetId);
      if (!budget) return null;
      return budget.selectedStartDate;
    };
  },
  getSelectedEndDate(state, getters) {
    return function(budgetId?: string) {
      const budget = getters.getBudgetById(budgetId);
      if (!budget) return null;
      return budget.selectedEndDate;
    };
  },
};

export default getters;
