export type Granularity = 'day' | 'month' | 'year';

export interface WorthDate {
  date: string;
  worth: number;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

export interface Tokens {
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
}

export interface Configuration {
  clientId: string;
  clientSecret: string;
  authRedirectUri: string;
  clientRedirectUri?: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
}

export interface MockYnabClient {
  get: Function;
}

export interface PeriodicTransactions {
  [date: string]: Transaction[];
}

export interface PeriodicWorth {
  [date: string]: WorthDate[];
}
