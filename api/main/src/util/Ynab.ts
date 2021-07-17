import {
  BudgetSummaryResponse,
  TransactionsResponse,
  TransactionDetail,
  AccountsResponse,
  UserResponse,
  BudgetDetail,
  Account,
  User,
} from 'ynab';
import OAuth2Client, { AuthClientConfig, ClientConfig, TokenResponse } from './OAuth2Client';

export interface WorthDate {
  date: string;
  worth: number;
  previous?: WorthDate;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
}

export interface PeriodicTransactions {
  [date: string]: Transaction[];
}

export interface PeriodicWorth {
  [date: string]: WorthDate[];
}

export default class YNAB extends OAuth2Client {
  constructor(config: ClientConfig) {
    const authConfig: AuthClientConfig = Object.assign({}, config, {
      authUrl: 'https://app.youneedabudget.com',
      apiUrl: 'https://api.youneedabudget.com/v1',
    });
    super(authConfig);
  }

  public async getUser(accessToken: string): Promise<User> {
    const response = await this.api.get<UserResponse>('/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const user = response.data.data.user;
    return user;
  }

  public async getBudgets(accessToken: string): Promise<BudgetDetail[]> {
    const response = await this.api.get<BudgetSummaryResponse>(`/budgets`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const budgets = response.data.data.budgets;
    return budgets;
  }

  public async getAccounts(budgetId: string, accessToken: string): Promise<Account[]> {
    const url = `/budgets/${budgetId}/accounts`;
    const response = await this.api.get<AccountsResponse>(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const accounts = response.data.data.accounts;
    return accounts;
  }

  public async getTransactions(budgetId: string, accessToken: string): Promise<TransactionDetail[]> {
    const url = `/budgets/${budgetId}/transactions`;

    const response = await this.api.get<TransactionsResponse>(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const transactions = response.data.data.transactions;
    return transactions;
  }

  public async getTransactionsByAccount(
    budgetId: string,
    accountId: string,
    accessToken: string,
  ): Promise<TransactionDetail[]> {
    const url = `/budgets/${budgetId}/accounts/${accountId}/transactions`;

    const response = await this.api.get<TransactionsResponse>(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const transactions = response.data.data.transactions;
    return transactions;
  }

  public async getAccessToken(code: string): Promise<TokenResponse> {
    const url = this.buildAccessTokenUrl(code);
    const response = await this.auth.post<TokenResponse>(url);
    return response.data;
  }

  public async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    const url = this.buildRefreshTokenUrl(refreshToken);
    const response = await this.auth.post<TokenResponse>(url);
    return response.data;
  }
}
