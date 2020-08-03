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
import { Configuration, TokenResponse, MockYnabClient } from './types';
import axios, { AxiosInstance } from 'axios';
import fs from 'fs/promises';

export default class YNAB {
  private clientId: string;
  private clientSecret: string;
  private authRedirectUri: string;
  private auth: AxiosInstance;
  private api: AxiosInstance | MockYnabClient;
  private static authUrl = 'https://app.youneedabudget.com';
  private static apiUrl = 'https://api.youneedabudget.com/v1';

  constructor(config: Configuration) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.authRedirectUri = config.authRedirectUri;

    this.auth = axios.create({ baseURL: YNAB.authUrl });
    this.api = this.createClient(YNAB.apiUrl);
  }

  private createClient(baseURL: string) {
    const env = process.env.NODE_ENV;

    if (env === 'local') {
      return {
        get: async (url: string) => ({
          data: JSON.parse(await fs.readFile(`static${url}.json`, 'utf-8')),
        }),
      };
    } else {
      return axios.create({ baseURL });
    }
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
