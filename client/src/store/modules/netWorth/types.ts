export interface NetWorthState {
  monthlyNetWorth: WorthDate[];
  accounts: Account[];
}

export interface WorthDate {
  date: string;
  worth: number;
  previous?: WorthDate;
}

export interface Account {
  id: string;
  name: string;
  months?: WorthDate[];
}
