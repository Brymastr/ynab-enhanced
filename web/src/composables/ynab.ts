import { computed, reactive, readonly } from 'vue';
import { BudgetDetail, Account } from 'ynab';
import { LoadingStatus, WorthDate } from './types';
import useYnabApi from '../api/ynab';
import { getUnixTime, endOfMonth, format, isAfter } from 'date-fns';
import { isBetween } from '@/services/helper';
import numeral from 'numeral';
import useComposition from './base';
const namespace = 'ynab';

const { persist, getModule } = useComposition();
const {
  getBudgets,
  getAccounts,
  getForecast: getRemoteForecast,
  getMonthlyNetWorth,
} = useYnabApi();

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
  budgetsUpdatedAt: null,
  accountsUpdatedAt: null,
  netWorthUpdatedAt: null,
  forecastUpdatedAt: null,
  loadingStatus: 'ready',
  loadingAccountsStatus: 'ready',
  loadingBudgetsStatus: 'ready',
  loadingNetWorthStatus: 'ready',
  loadingForecastStatus: 'ready',
};

const state = reactive(defaultState);

function set() {
  persist(namespace, state);
}

function getBudgetById(budgetId?: string) {
  const id = budgetId ?? state.selectedBudgetId;
  return state.budgets.find(budget => budget.id === id);
}
const getDateList = computed(() => {
  const budget = getBudgetById();
  return budget?.dateList ?? [];
});
const getNetWorth = computed(() => {
  const budget = getBudgetById();
  return budget?.monthlyNetWorth ?? [];
});
const getForecast = computed(() => {
  const budget = getBudgetById();
  return budget?.forecast ?? [];
});
const getCombined = computed((budgetId?: string) => {
  const budget = getBudgetById(budgetId);
  return budget?.monthlyNetWorth?.concat(...(budget.forecast ?? [])) ?? [];
});
const getSelectedStartDate = computed(() => {
  const budget = getBudgetById();
  if (!budget) return null;
  return budget.selectedStartDate;
});
const getSelectedEndDate = computed(() => {
  const budget = getBudgetById();
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
function setBudgetsUpdatedAt(date: number | null) {
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
  set();
}
function setNetWorthUpdatedAt(date: number) {
  state.netWorthUpdatedAt = date;
  set();
}
function setForecastUpdatedAt(date: number) {
  state.forecastUpdatedAt = date;
  set();
}

function createOrUpdateBudget(budget: Budget) {
  const index = state.budgets.findIndex(b => b.id === budget.id);

  if (index !== -1) state.budgets.splice(index, 1);

  const selectedStartDate = new Date(budget.first_month ?? '');
  const selectedEndDate = new Date(budget.last_month ?? '');
  budget.selectedStartDate = selectedStartDate.toISOString();
  budget.selectedEndDate = selectedEndDate.toISOString();
  budget.monthlyNetWorth = budget.monthlyNetWorth ?? [];
  budget.forecast = budget.forecast ?? [];
  budget.dateList = budget.monthlyNetWorth.map(({ date }) => {
    const formatted = format(endOfMonth(new Date(date)), 'yyyy-MM-dd');
    return formatted;
  });

  state.budgets.push(budget);
  set();
}

function createOrUpdateAccounts(payload: AccountsPayload) {
  const budget = state.budgets.find(budget => budget.id === payload.budgetId);

  if (budget === undefined) return null;

  const budgetAccounts = budget.accounts;
  if (budgetAccounts === null || budgetAccounts === undefined) return null;

  budgetAccounts.length = 0;
  payload.accounts.forEach(account => budgetAccounts.push(account));
  set();
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

  const budget = getBudgetById(budgetId);
  if (!budget) {
    setLoadingForecast('complete');
    setTimeout(() => setLoadingForecast('ready'), 2000);
    return;
  }

  const netWorth = budget.monthlyNetWorth;
  if (netWorth === undefined) {
    setLoadingForecast('complete');
    setTimeout(() => setLoadingForecast('ready'), 2000);
    return;
  }

  const forecast = await getRemoteForecast(netWorth);

  const updatedBudget = Object.assign({}, budget, { forecast });

  createOrUpdateBudget(updatedBudget);

  setLoadingForecast('complete');

  setForecastUpdatedAt(getUnixTime(Date.now()));

  setTimeout(() => setLoadingForecast('ready'), 2000);
}

function loadMonthlyData() {
  loadNetWorth();
  // loadForecast();
}

function setSelectedBudget(budget: Budget) {
  state.selectedBudgetId = budget.id;
  state.selectedBudgetName = budget.name;
  set();
}

function budgetSelected(budget: Budget) {
  if (budget.id === state.selectedBudgetId) return;
  setSelectedBudget(budget);

  numeral.locale(budget.currency_format?.iso_code);
  const netWorth = getNetWorth.value;
  if (netWorth.length === 0) loadMonthlyData();
}

function clearState() {
  state.selectedBudgetId = null;
  state.selectedBudgetName = null;
  state.budgets.length = 0;
  setBudgetsUpdatedAt(null);
  set();
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

const sortedBudgets = computed(() => {
  return state.budgets.sort((a, b) => {
    const aDate = new Date(a.last_modified_on ?? '');
    const bDate = new Date(b.last_modified_on ?? '');

    return isAfter(aDate, bDate) ? -1 : 1;
  });
});

function reset() {
  const x = getModule<State>(namespace);
  if (x?.budgets !== undefined) state.budgets = x.budgets;
  if (x?.selectedBudgetId !== undefined) state.selectedBudgetId = x.selectedBudgetId;
  if (x?.selectedBudgetName !== undefined) state.selectedBudgetName = x.selectedBudgetName;
  if (x?.budgetsUpdatedAt !== undefined) state.budgetsUpdatedAt = x.budgetsUpdatedAt;
  if (x?.accountsUpdatedAt !== undefined) state.accountsUpdatedAt = x.accountsUpdatedAt;
  if (x?.netWorthUpdatedAt !== undefined) state.netWorthUpdatedAt = x.netWorthUpdatedAt;
  if (x?.forecastUpdatedAt !== undefined) state.forecastUpdatedAt = x.forecastUpdatedAt;
  if (x?.loadingStatus !== undefined) state.loadingStatus = x.loadingStatus;
  if (x?.loadingAccountsStatus !== undefined) state.loadingAccountsStatus = x.loadingAccountsStatus;
  if (x?.loadingBudgetsStatus !== undefined) state.loadingBudgetsStatus = x.loadingBudgetsStatus;
  if (x?.loadingNetWorthStatus !== undefined) state.loadingNetWorthStatus = x.loadingNetWorthStatus;
  if (x?.loadingForecastStatus !== undefined) state.loadingForecastStatus = x.loadingForecastStatus;
}

export default function useYnab() {
  return {
    state: readonly(state),
    selectedBudgetId: computed(() => state.selectedBudgetId),
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
    clearState,
    reset,
  };
}
