import axios from 'axios';
import { BudgetDetail } from 'ynab';

const ynab = axios.create({ baseURL: '/api' });

export async function getBudgets(): Promise<BudgetDetail[]> {
  const response = await ynab.get<BudgetDetail[]>('/budgets');
  return response.data;
}

// export function getAccounts(budgetId: string) {}

// export function getNetWorth(budgetId: string) {}
