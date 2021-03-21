import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { BudgetDetail, Account } from 'ynab';
import { WorthDate } from '@/composables/types';
import { ref } from 'vue';
import useSession from '@/composables/session';

const { getToken } = useSession();
const token = getToken.value;

const baseConfig = ref<AxiosRequestConfig>({
  baseURL: `${process.env.VUE_APP_API}/ynab`,
  headers: { 'wealth-session-token': token },
});

const ynab = ref<AxiosInstance>(axios.create(baseConfig.value));

async function getBudgets(): Promise<BudgetDetail[]> {
  const response = await ynab.value.get<BudgetDetail[]>('/budgets');
  return response.data;
}

async function getAccounts(budgetId: string) {
  const response = await ynab.value.get<Account[]>(`/budgets/${budgetId}/accounts`);
  return response.data;
}

async function getMonthlyNetWorth(budgetId: string) {
  const response = await ynab.value.get<WorthDate[]>(`/budgets/${budgetId}/monthlyNetWorth`);
  response.data.pop();
  return response.data;
}

async function getForecast(budgetId: string) {
  const response = await ynab.value.get<WorthDate[]>(`/budgets/${budgetId}/forecast`);
  return response.data;
}

export default function useYnab() {
  return { getBudgets, getAccounts, getMonthlyNetWorth, getForecast };
}
