import 'util/registration';

import { createPeriodicNetWorth, ynabClientFactory } from 'util/helpers';
import { basicCatch } from 'util/catchers';
import sessionMiddleware, { Result as SessionTokenResult } from 'middleware/sessionToken';
import respond, { ApiResponse } from 'middleware/respond';
import Middleware from 'middleware/Middleware';

/**
 * This function runs after the sessionMiddleware function has completed
 * and therefore this function can expect the output of sessionMiddleware as input.
 */
async function main(input: SessionTokenResult): Promise<ApiResponse> {
  const { sessionToken, budgetId, includePrevious } = input;

  const { ynab, accessToken } = await ynabClientFactory(sessionToken);

  const transactions = await ynab.getTransactions(budgetId, accessToken);

  const monthlyNetWorth = createPeriodicNetWorth(transactions, 'month', includePrevious);

  return { body: monthlyNetWorth };
}

/**
 * The step for this idea is to rework the typings so that each call to pipe
 * knows the output of the previous call and can result in typescript errors
 * in the case of mismatched input/output. Additionally I would like to negate
 * the need for the handler function and just have the final pipe call dictate
 * the return type of the resulting composed function.
 */
export const handler = new Middleware()
  .pipe(sessionMiddleware)
  .pipe(main)
  .pipe(respond)
  .catch(basicCatch)
  .handler();
