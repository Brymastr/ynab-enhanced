import { Granularity, granularityErrorMessage, isGranularity } from 'src/util/types';
import { Result as SessionTokenResult } from './sessionToken';

export interface Result {
  budgetId: string | null;
  accountId: string | null;
  includePrevious: boolean;
  granularity?: Granularity;
  body: Record<string, string | number | boolean> | null;
  sessionToken: string;
}

export default async function sessionMiddleware(input: SessionTokenResult): Promise<Result> {
  const { body, pathParameters, queryStringParameters, sessionToken } = input;

  const granularity = pathParameters.granularity;

  if (!isGranularity(granularity)) throw { code: 400, message: granularityErrorMessage };

  const budgetId = pathParameters.budget_id ?? null;
  const accountId = pathParameters.account_id ?? null;
  const includePrevious = queryStringParameters.includePrevious == 'true';

  return { budgetId, accountId, includePrevious, granularity, body, sessionToken };
}
