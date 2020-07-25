import moment from 'moment';
import { WorthDate, TokenResponse, Configuration, Transaction, Tokens } from './types';

export function worthAtDate(
  transactions: Transaction[],
  date: string = moment().format('YYYY-MM-DD'),
): number {
  const balance = transactions
    .filter(x => moment(x.date).isSameOrBefore(moment(date)))
    .map(x => x.amount)
    .reduce((a, c) => a + c, 0);

  return balance / 1000;
}

export function createMonthlyNetWorth(transactions: Transaction[]): WorthDate[] {
  const firstMonth = moment(transactions[0].date).endOf('month');
  const lastMonth = moment();
  const monthDifference = lastMonth.diff(firstMonth, 'months', true);
  const monthlyWorthList: WorthDate[] = [];

  for (let i = 0; i <= monthDifference + 1; i++) {
    const date = moment(firstMonth).add(i, 'months').endOf('month').format('YYYY-MM-DD');
    const worth = worthAtDate(transactions, date);
    monthlyWorthList.push({ date, worth });
  }

  return monthlyWorthList;
}

export function parseTokens(tokenResponse: TokenResponse): Tokens {
  const { access_token, refresh_token, expires_in } = tokenResponse;

  const tokens: Tokens = {
    access_token,
    refresh_token,
    expires_at: moment().add(expires_in, 'seconds').format('X'),
  };

  return tokens;
}
