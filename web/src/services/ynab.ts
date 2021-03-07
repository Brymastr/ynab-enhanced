import axios from 'axios';
import { BudgetDetail, Account } from 'ynab';
import { WorthDate } from '../store/modules/ynab/types';

const ynab = axios.create({ baseURL: `${process.env.VUE_APP_API}/ynab` });

export async function getBudgets(sessionToken: string): Promise<BudgetDetail[]> {
  const response = await ynab.get<BudgetDetail[]>('/budgets', {
    headers: { 'wealth-session-token': sessionToken },
  });
  return response.data;
}

export async function getAccounts(budgetId: string) {
  const response = await ynab.get<Account[]>(`/budgets/${budgetId}/accounts`);
  return response.data;
}

export async function getMonthlyNetWorth(budgetId: string) {
  const response = await ynab.get<WorthDate[]>(`/budgets/${budgetId}/monthlyNetWorth`);
  response.data.pop();
  return response.data;
}

export async function getForecast(budgetId: string) {
  const response = await ynab.get<WorthDate[]>(`/budgets/${budgetId}/forecast`);
  return response.data;
}
