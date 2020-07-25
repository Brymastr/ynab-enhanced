export interface YnabState {
  selectedBudgetId: string | null;
  budgets: Budget[];
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
