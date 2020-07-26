export type loadingStatus = 'loading' | 'complete' | 'ready';

export interface YnabState {
  selectedBudgetId: string | null;
  budgets: Budget[];
  loadingBudgetsStatus: loadingStatus;
  loadingAccountsStatus: loadingStatus;
  loadingNetWorthStatus: loadingStatus;
}

export interface Budget {
  id: string;
  name: string;
  accounts: Account[];
}

export interface Account {
  id: string;
  name: string;
}
