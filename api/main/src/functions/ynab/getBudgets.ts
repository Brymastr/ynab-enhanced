import 'util/registration';

import { ynabClientFactory } from 'util/helpers';
import { basicCatch } from 'util/catchers';
import sessionMiddleware, { Result as SessionTokenResult } from 'middleware/sessionToken';
import Middleware from 'middleware/Middleware';
import respond, { ApiResponse } from '../middleware/respond';

async function main(input: SessionTokenResult): Promise<ApiResponse> {
  const { sessionToken } = input;

  const { ynab, accessToken } = await ynabClientFactory(sessionToken);

  const budgets = await ynab.getBudgets(accessToken);

  return { body: budgets };
}

// prettier-ignore
export const handler = new Middleware()
  .pipe(sessionMiddleware)
  .pipe(main)
  .pipe(respond)
  .catch(basicCatch)
  .handler();
