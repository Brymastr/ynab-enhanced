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
import axios, { AxiosInstance } from 'axios';

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

export interface WorthDate {
  date: string;
  worth: number;
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

export interface ClientConfig {
  clientId: string;
  clientSecret: string;
  authRedirectUri?: string;
  clientRedirectUri?: string;
}

export default class YNAB {
  private clientId: string;
  private clientSecret: string;
  private authRedirectUri: string;
  private auth: AxiosInstance;
  private api: AxiosInstance;
  private static authUrl = 'https://app.youneedabudget.com';
  private static apiUrl = 'https://api.youneedabudget.com/v1';

  constructor(config: ClientConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.authRedirectUri = config.authRedirectUri;

    this.auth = axios.create({ baseURL: YNAB.authUrl });
    this.api = axios.create({ baseURL: YNAB.apiUrl });
  }

  public async getUser(accessToken: string): Promise<User> {
    const response = await this.api.get<UserResponse>('/url', {
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

  public async getTransactions(
    budgetId: string,
    accessToken: string,
  ): Promise<TransactionDetail[]> {
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

  public async refreshAccessToken(token: string): Promise<TokenResponse> {
    const url = this.buildRefreshTokenUrl(token);
    const response = await this.auth.post<TokenResponse>(url);
    return response.data;
  }

  public buildAuthorizeUrl(): string {
    const clientId = `client_id=${this.clientId}`;
    const redirectUri = `redirect_uri=${this.authRedirectUri}`;
    const responseType = 'response_type=code';
    const scope = 'scope=read-only';
    const url = `${YNAB.authUrl}/oauth/authorize?${clientId}&${redirectUri}&${responseType}&${scope}`;
    return url;
  }

  private buildAccessTokenUrl(code: string): string {
    const clientId = `client_id=${this.clientId}`;
    const clientSecret = `client_secret=${this.clientSecret}`;
    const redirectUri = `redirect_uri=${this.authRedirectUri}`;
    const grantType = 'grant_type=authorization_code';
    const url = `/oauth/token?${clientId}&${clientSecret}&${redirectUri}&${grantType}&code=${code}`;
    return url;
  }

  private buildRefreshTokenUrl(token: string): string {
    const clientId = `client_id=${this.clientId}`;
    const clientSecret = `client_secret=${this.clientSecret}`;
    const grantType = 'grant_type=refresh_token';
    const rToken = `refresh_token=${token}`;
    const url = `/oauth/token?${clientId}&${clientSecret}&${grantType}&${rToken}`;
    return url;
  }
}
