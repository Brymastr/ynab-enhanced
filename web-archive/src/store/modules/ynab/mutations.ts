import { MutationTree, Mutation } from 'vuex';
import { YnabState, AccountsPayload, Budget, LoadingStatus } from './types';

const createOrUpdateBudget: Mutation<YnabState> = function(state, budget: Budget) {
  const index = state.budgets.findIndex(b => b.id === budget.id);

  if (index !== -1) state.budgets.splice(index, 1);

  state.budgets.push(budget);
};

const createOrUpdateAccounts: Mutation<YnabState> = function(state, payload: AccountsPayload) {
  const budget = state.budgets.find(budget => budget.id === payload.budgetId);

  if (budget === undefined) return null;

  const budgetAccounts = budget.accounts;
  if (budgetAccounts === null || budgetAccounts === undefined) return null;

  budgetAccounts.length = 0;
  payload.accounts.forEach(account => budgetAccounts.push(account));
};

const mutations: MutationTree<YnabState> = {
  createOrUpdateBudget,
  createOrUpdateAccounts,
  setBudgetStartDate(state, payload: Budget) {
    const budget = state.budgets.find(x => x.id === payload.id);
    if (!budget) return;
    budget.selectedStartDate = payload.selectedStartDate;
  },
  setBudgetEndDate(state, payload: Budget) {
    const budget = state.budgets.find(x => x.id === payload.id);
    if (!budget) return;
    budget.selectedEndDate = payload.selectedEndDate;
  },
  setSelectedBudget(state, budget: Budget) {
    state.selectedBudgetId = budget.id;
    state.selectedBudgetName = budget.name;
  },
  setDateList(state, payload: Budget) {
    const budget = state.budgets.find(x => x.id === payload.id);
    if (!budget) return;
    budget.dateList = payload.dateList;
  },
  setLoading(state, status: LoadingStatus) {
    state.loadingStatus = status;
  },
  setLoadingBudgets(state, status: LoadingStatus) {
    state.loadingBudgetsStatus = status;
  },
  setLoadingAccounts(state, status: LoadingStatus) {
    state.loadingAccountsStatus = status;
  },
  setLoadingForecast(state, status: LoadingStatus) {
    state.loadingForecastStatus = status;
  },
  setLoadingNetWorth(state, status: LoadingStatus) {
    state.loadingNetWorthStatus = status;
  },
  setBudgetsUpdatedAt(state, date: number) {
    state.budgetsUpdatedAt = date;
  },
  setAccountsUpdatedAt(state, date: number) {
    state.accountsUpdatedAt = date;
  },
  setNetWorthUpdatedAt(state, date: number) {
    state.netWorthUpdatedAt = date;
  },
  setForecastUpdatedAt(state, date: number) {
    state.forecastUpdatedAt = date;
  },
  clear(state) {
    state.budgets.length = 0;
    state.selectedBudgetId = null;
    state.loadingStatus = 'ready';
    state.loadingAccountsStatus = 'ready';
    state.loadingBudgetsStatus = 'ready';
    state.loadingNetWorthStatus = 'ready';
    state.loadingForecastStatus = 'ready';
    state.budgetsUpdatedAt = null;
    state.accountsUpdatedAt = null;
    state.netWorthUpdatedAt = null;
    state.forecastUpdatedAt = null;
  },
};

export default mutations;
