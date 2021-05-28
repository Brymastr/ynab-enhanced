import '../../util/registration';

import { createPeriodicNetWorth, ynabClientFactory } from 'util/helpers';
import { basicCatch } from 'util/catchers';
import sessionMiddleware, { Result as SessionTokenResult } from 'middleware/sessionToken';
import respond, { ApiResponse } from 'middleware/respond';
import Middleware from 'middleware/Middleware';

async function main(input: SessionTokenResult): Promise<ApiResponse> {
  const { sessionToken, budgetId, accountId } = input;

  const { ynab, accessToken } = await ynabClientFactory(sessionToken);

  const transactions = await ynab.getTransactionsByAccount(budgetId, accountId, accessToken);

  const monthlyNetWorth = createPeriodicNetWorth(transactions, 'month');

  return { body: monthlyNetWorth };
}

// prettier-ignore
export const handler = new Middleware()
  .pipe(sessionMiddleware)
  .pipe(main)
  .pipe(respond)
  .catch(basicCatch)
  .handler();
