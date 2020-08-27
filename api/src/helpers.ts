import moment from 'moment';
import axios from 'axios';
import fs from 'fs/promises';

import {
  WorthDate,
  TokenResponse,
  Transaction,
  Tokens,
  PeriodicTransactions,
  Granularity,
} from './types';

export function createPeriodicNetWorth(allTransactions: Transaction[], granularity: Granularity) {
  const worthList: WorthDate[] = [];
  const periodicTransactions: PeriodicTransactions = {};

  allTransactions.forEach(transaction => {
    const date = moment(transaction.date).endOf(granularity).format('YYYY-MM-DD');
    if (periodicTransactions[date] === undefined) periodicTransactions[date] = [];
    periodicTransactions[date].push(transaction);
  });

  let previousWorth = 0;
  for (const [date, transactions] of Object.entries(periodicTransactions)) {
    const periodWorth = transactions.map(({ amount }) => amount).reduce((a, c) => a + c, 0) / 1000;
    const worth = +(previousWorth + periodWorth).toFixed(2);
    worthList.push({ date, worth });
    previousWorth += periodWorth;
  }

  return worthList;
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

export async function getProjectedNetWorth(dailyNetWorth: WorthDate[]) {
  let result: WorthDate[];

  if (process.env.NODE_ENV === 'local') {
    const response = await fs.readFile('../projections/output.json', 'utf8');
    result = JSON.parse(response) as WorthDate[];
  } else {
    const response = await axios.post<WorthDate[]>(
      `${process.env.forecaseUrl}/forecast`,
      dailyNetWorth,
    );
    result = response.data;
  }

  return result;
}
