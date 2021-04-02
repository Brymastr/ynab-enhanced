import { GetterTree } from 'vuex';
import { YnabState, Budget, WorthDate } from './types';
import { RootState } from '@/store/types';
import moment from 'moment';

const getters: GetterTree<YnabState, RootState> = {
  getBudgetById(state) {
    return function(budgetId?: string) {
      const id = budgetId ?? state.selectedBudgetId;
      return state.budgets.find(budget => budget.id === id);
    };
  },
  getDateList(state, getters) {
    return function(budgetId?: string) {
      const budget: Budget = getters.getBudgetById(budgetId);
      if (!budget) return null;
      return budget.dateList;
    };
  },
  getNetWorth(state, getters) {
    return function(budgetId?: string) {
      const budget: Budget = getters.getBudgetById(budgetId);
      if (!budget) return null;
      return budget.monthlyNetWorth;
    };
  },
  getForecast(state, getters) {
    return function(budgetId?: string) {
      const budget: Budget = getters.getBudgetById(budgetId);
      if (!budget) return null;
      return budget.forecast;
    };
  },
  getCombined(state, getters) {
    return function(budgetId?: string) {
      const budget: Budget = getters.getBudgetById(budgetId);
      if (!budget) return null;
      return budget.monthlyNetWorth.concat(...budget.forecast);
    };
  },
  getSelectedStartDate(state, getters) {
    return function(budgetId?: string) {
      const budget: Budget = getters.getBudgetById(budgetId);
      if (!budget) return null;
      return budget.selectedStartDate;
    };
  },
  getSelectedEndDate(state, getters) {
    return function(budgetId?: string) {
      const budget: Budget = getters.getBudgetById(budgetId);
      if (!budget) return null;
      return budget.selectedEndDate;
    };
  },
  getFilteredDateRange(state, getters) {
    return function(type: 'NetWorth' | 'Forecast' | 'Combined') {
      const all: WorthDate[] = getters[`get${type}`]();
      const start: string = getters.getSelectedStartDate();
      const end: string = getters.getSelectedEndDate();

      return all.filter(({ date }) => {
        const current = moment(date);
        return current.isBetween(moment(start), moment(end), undefined, '[]');
      });
    };
  },
};

export default getters;
