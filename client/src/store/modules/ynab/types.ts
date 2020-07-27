import { BudgetDetail, Account } from 'ynab';

export type LoadingStatus = 'loading' | 'complete' | 'ready';

export interface YnabState {
  selectedBudgetId: string | null;
  budgets: Budget[];
  loadingBudgetsStatus: LoadingStatus;
  loadingAccountsStatus: LoadingStatus;
  loadingNetWorthStatus: LoadingStatus;
}

export interface AccountsPayload {
  budgetId: string;
  accounts: Account[];
}

export interface Budget extends BudgetDetail {
  monthlyNetWorth: WorthDate[];
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
