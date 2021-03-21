import { computed, reactive, readonly } from 'vue';
import { BudgetDetail, Account } from 'ynab';
import { LoadingStatus, WorthDate } from './types';
import useYnabService from '../services/ynab';
import { getUnixTime, endOfMonth, format, isAfter } from 'date-fns';
import { isBetween } from '@/services/helper';
import numeral from 'numeral';

const {
  getBudgets,
  getAccounts,
  getForecast: getRemoteForecast,
  getMonthlyNetWorth,
} = useYnabService();

interface AccountsPayload {
  budgetId: string;
  accounts: Account[];
}

export interface Budget extends BudgetDetail {
  monthlyNetWorth?: WorthDate[];
  forecast?: WorthDate[];
  selectedStartDate?: string;
  selectedEndDate?: string;
  dateList?: string[];
}

interface State {
  selectedBudgetId: string | null;
  selectedBudgetName: string | null;
  budgets: Budget[];
  loadingStatus: LoadingStatus;
  loadingBudgetsStatus: LoadingStatus;
  loadingAccountsStatus: LoadingStatus;
  loadingNetWorthStatus: LoadingStatus;
  loadingForecastStatus: LoadingStatus;
  budgetsUpdatedAt: number | null;
  accountsUpdatedAt: number | null;
  netWorthUpdatedAt: number | null;
  forecastUpdatedAt: number | null;
}

const defaultState: State = {
  budgets: [],
  selectedBudgetId: null,
  selectedBudgetName: null,
  loadingStatus: 'ready',
  loadingAccountsStatus: 'ready',
  loadingBudgetsStatus: 'ready',
  loadingNetWorthStatus: 'ready',
  loadingForecastStatus: 'ready',
  budgetsUpdatedAt: null,
  accountsUpdatedAt: null,
  netWorthUpdatedAt: null,
  forecastUpdatedAt: null,
};

const state = reactive(defaultState);

function getBudgetById(budgetId?: string) {
  const id = budgetId ?? state.selectedBudgetId;
  return state.budgets.find(budget => budget.id === id);
}
const getDateList = computed((budgetId?: string) => {
  const budget = getBudgetById(budgetId);
  return budget?.dateList ?? [];
});
const getNetWorth = computed(() => {
  const budget = getBudgetById();
  return budget?.monthlyNetWorth ?? [];
});
const getForecast = computed((budgetId?: string) => {
  const budget = getBudgetById(budgetId);
  return budget?.forecast ?? [];
});
const getCombined = computed((budgetId?: string) => {
  const budget = getBudgetById(budgetId);
  return budget?.monthlyNetWorth?.concat(...(budget.forecast ?? [])) ?? [];
});
const getSelectedStartDate = computed((budgetId?: string) => {
  const budget = getBudgetById(budgetId);
  if (!budget) return null;
  return budget.selectedStartDate;
});
const getSelectedEndDate = computed((budgetId?: string) => {
  const budget = getBudgetById(budgetId);
  if (!budget) return null;
  return budget.selectedEndDate;
});
const getFilteredDateRange = (type: 'NetWorth' | 'Forecast' | 'Combined') => {
  let all: WorthDate[] = [];
  if (type === 'NetWorth') all = getNetWorth.value;
  else if (type === 'Forecast') all = getForecast.value;
  else if (type === 'Combined') all = getCombined.value;
  const start = getSelectedStartDate.value;
  const end = getSelectedEndDate.value;
  if (!start || !end) return null;

  return all.filter(({ date }) => isBetween(new Date(date), new Date(start), new Date(end)));
};

function setLoadingBudgets(status: LoadingStatus) {
  state.loadingBudgetsStatus = status;
}
function setLoadingAccounts(status: LoadingStatus) {
  state.loadingAccountsStatus = status;
}
function setLoadingForecast(status: LoadingStatus) {
  state.loadingForecastStatus = status;
}
function setLoadingNetWorth(status: LoadingStatus) {
  state.loadingNetWorthStatus = status;
}
function setBudgetsUpdatedAt(date: number) {
  state.budgetsUpdatedAt = date;
}
function setBudgetStartDate(payload: any) {
  const budget = state.budgets.find(x => x.id === payload.id);
  if (!budget) return;
  budget.selectedStartDate = payload.selectedStartDate;
}
function setBudgetEndDate(payload: any) {
  const budget = state.budgets.find(x => x.id === payload.id);
  if (!budget) return;
  budget.selectedEndDate = payload.selectedEndDate;
}
function setAccountsUpdatedAt(date: number) {
  state.accountsUpdatedAt = date;
}
function setNetWorthUpdatedAt(date: number) {
  state.netWorthUpdatedAt = date;
}
function setForecastUpdatedAt(date: number) {
  state.forecastUpdatedAt = date;
}
function budgetSelected(budget: Budget) {
  if (budget.id === state.selectedBudgetId) return;
  setSelectedBudget(budget);

  numeral.locale(budget.currency_format?.iso_code);
  const netWorth = getNetWorth.value;
  if (!netWorth) loadMonthlyData();
}

function setSelectedBudget(budget: Budget) {
  state.selectedBudgetId = budget.id;
  state.selectedBudgetName = budget.name;
}

function createOrUpdateBudget(budget: Budget) {
  const index = state.budgets.findIndex(b => b.id === budget.id);

  if (index !== -1) state.budgets.splice(index, 1);

  state.budgets.push(budget);
}

function createOrUpdateAccounts(payload: AccountsPayload) {
  const budget = state.budgets.find(budget => budget.id === payload.budgetId);

  if (budget === undefined) return null;

  const budgetAccounts = budget.accounts;
  if (budgetAccounts === null || budgetAccounts === undefined) return null;

  budgetAccounts.length = 0;
  payload.accounts.forEach(account => budgetAccounts.push(account));
}

async function loadBudgets() {
  setLoadingBudgets('loading');
  const remoteBudgets = await getBudgets();

  for (const remoteBudget of remoteBudgets) {
    const existingBudget = state.budgets.find(b => b.id === remoteBudget.id);
    if (existingBudget !== undefined) {
      const updatedBudget = Object.assign({}, existingBudget, remoteBudget);
      createOrUpdateBudget(updatedBudget);
    } else {
      createOrUpdateBudget(remoteBudget);
    }
  }

  setLoadingBudgets('complete');
  setBudgetsUpdatedAt(getUnixTime(Date.now()));

  setTimeout(() => setLoadingBudgets('ready'), 2000);
}

async function loadAccounts() {
  setLoadingAccounts('loading');

  const budgetId = state.selectedBudgetId;

  if (!budgetId) return null;

  const remoteAccounts = await getAccounts(budgetId);

  const accountsPayload = { budgetId, accounts: remoteAccounts };

  createOrUpdateAccounts(accountsPayload);

  setLoadingAccounts('complete');

  setAccountsUpdatedAt(getUnixTime(Date.now()));

  setTimeout(() => setLoadingAccounts('ready'), 2000);
}

async function loadNetWorth() {
  setLoadingAccounts('loading');

  const budgetId = state.selectedBudgetId;

  if (!budgetId) return null;

  const monthlyNetWorth = await getMonthlyNetWorth(budgetId);

  const budget = state.budgets.find(b => b.id === budgetId);
  if (!budget) return;

  const selectedStartDate =
    budget.selectedStartDate ??
    format(endOfMonth(new Date(budget.first_month ?? '')), 'YYYY-MM-DD');

  const selectedEndDate =
    budget.selectedEndDate ??
    format(endOfMonth(new Date(monthlyNetWorth[monthlyNetWorth.length - 1].date)), 'YYYY-MM-DD');

  const updatedBudget = Object.assign({}, budget, {
    monthlyNetWorth,
    selectedStartDate,
    selectedEndDate,
  });

  createOrUpdateBudget(updatedBudget);

  setLoadingNetWorth('complete');

  setNetWorthUpdatedAt(getUnixTime(Date.now()));

  setTimeout(() => setLoadingNetWorth('ready'), 2000);
}

async function loadForecast() {
  setLoadingAccounts('loading');

  const budgetId = state.selectedBudgetId;

  if (!budgetId) return null;

  const forecast = await getRemoteForecast(budgetId);

  const budget = getBudgetById(budgetId);
  if (!budget) return;

  const updatedBudget = Object.assign({}, budget, { forecast });

  createOrUpdateBudget(updatedBudget);

  setLoadingForecast('complete');

  setForecastUpdatedAt(getUnixTime(Date.now()));

  setTimeout(() => setLoadingForecast('ready'), 2000);
}

function loadMonthlyData() {
  loadNetWorth();
  loadForecast();
}

const sortedBudgets = computed(() => {
  return state.budgets.sort((a, b) => {
    const aDate = new Date(a.last_modified_on ?? '');
    const bDate = new Date(b.last_modified_on ?? '');

    return isAfter(aDate, bDate) ? -1 : 1;
  });
});

export default function useYnab() {
  return {
    state: readonly(state),
    sortedBudgets,
    getBudgetById,
    getDateList,
    getNetWorth,
    getForecast,
    getCombined,
    getSelectedStartDate,
    getSelectedEndDate,
    loadBudgets,
    loadAccounts,
    setBudgetStartDate,
    setBudgetEndDate,
    getFilteredDateRange,
    loadMonthlyData,
    budgetSelected,
  };
}
