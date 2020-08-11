import { BudgetDetail, Account } from 'ynab';

export type LoadingStatus = 'loading' | 'complete' | 'ready';

export interface YnabState {
  selectedBudgetId: string | null;
  selectedBudgetName: string | null;
  budgets: Budget[];
  loadingBudgetsStatus: LoadingStatus;
  loadingAccountsStatus: LoadingStatus;
  loadingNetWorthStatus: LoadingStatus;
  budgetsUpdatedAt: number | null;
  accountsUpdatedAt: number | null;
  netWorthUpdatedAt: number | null;
}

export interface AccountsPayload {
  budgetId: string;
  accounts: Account[];
}

export interface Budget extends BudgetDetail {
  monthlyNetWorth: WorthDate[];
  selectedStartDate: string;
  selectedEndDate: string;
}

export interface WorthDate {
  date: string;
  worth: number;
  previous?: WorthDate;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface MonthlyNetWorthPayload {
  budgetId: string;
  accountId: string;
  monthlyNetWorth: WorthDate[];
}