export interface NetWorthState {
  months: MonthlyNetWorth;
  accounts: Account[];
}

export interface MonthlyNetWorth {
  [month: string]: number;
}

export interface Account {
  id: string;
  name: string;
  months?: MonthlyNetWorth;
}
