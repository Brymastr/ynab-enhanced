import '../../util/registration';

import { createResponse, ynabClientFactory } from 'util/helpers';
import { basicCatch } from 'util/catchers';
import sessionMiddleware, { Result as SessionTokenResult } from 'middleware/sessionToken';
import Middleware from 'src/experimental/Middleware2';

async function main(input: SessionTokenResult) {
  const { sessionToken } = input;

  const { ynab, accessToken } = await ynabClientFactory(sessionToken);

  const budgets = await ynab.getBudgets(accessToken);
  return createResponse(200, budgets);
}

// prettier-ignore
export const handler = new Middleware()
  .pipe(sessionMiddleware)
  .pipe(main)
  .catch(basicCatch)
  .handler();
