import '../../util/registration';

import { ynabClientFactory } from 'util/helpers';
import { basicCatch } from 'util/catchers';
import sessionMiddleware, { Result as SessionTokenResult } from 'middleware/sessionToken';
import respond, { ApiResponse } from 'middleware/respond';
import Middleware from 'middleware/Middleware';

async function main(input: SessionTokenResult): Promise<ApiResponse> {
  const { sessionToken, budgetId } = input;

  const { ynab, accessToken } = await ynabClientFactory(sessionToken);

  const accounts = await ynab.getAccounts(budgetId, accessToken);

  return { body: accounts };
}

// prettier-ignore
export const handler = new Middleware()
  .pipe(sessionMiddleware)
  .pipe(main)
  .pipe(respond)
  .catch(basicCatch)
  .handler();
