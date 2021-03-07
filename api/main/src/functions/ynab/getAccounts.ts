import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse, ynabClientFactory } from '../../util/helpers';

export const handler: APIGatewayProxyHandler = async event => {
  const sessionToken = event.headers['wealth-session-token'];
  if (!sessionToken) return createResponse(401, { message: 'Invalid or missing session token' });

  const budgetId = event.pathParameters.budget_id;

  const { ynab, accessToken } = await ynabClientFactory(sessionToken);

  const accounts = await ynab.getAccounts(budgetId, accessToken);
  return createResponse(200, { accounts });
};
