import { WorthDate } from '@/composables/types';
import { BudgetDetail, Account } from 'ynab';
import session from '../composables/session';

const getOptions = (): RequestInit => ({
  headers: { 'wealth-session-token': session.getToken.value ?? '' },
});

export async function getBudgets(): Promise<BudgetDetail[]> {
  const response = await fetch('/budgets', getOptions());

  const responseData: BudgetDetail[] = await response.json();
  return responseData;
}

export async function getAccounts(budgetId: string) {
  const response = await fetch(`/budgets/${budgetId}/accounts`, getOptions());

  const responseData: Account[] = await response.json();
  return responseData;
}

export async function getMonthlyNetWorth(budgetId: string) {
  const response = await fetch(`/budgets/${budgetId}/monthlyNetWorth`, getOptions());

  const responseData: WorthDate[] = await response.json();
  responseData.pop();
  return responseData;
}

export async function getForecast(budgetId: string) {
  const response = await fetch(`/budgets/${budgetId}/forecast`, getOptions());

  const responseData: WorthDate[] = await response.json();
  return responseData;
}
