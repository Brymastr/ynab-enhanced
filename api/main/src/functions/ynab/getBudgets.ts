import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse, ynabClientFactory } from '../../util/helpers';

export const handler: APIGatewayProxyHandler = async event => {
  const sessionToken = event.headers['wealth-session-token'];
  if (!sessionToken) return createResponse(401, { message: 'Invalid or missing session token' });

  const { ynab, accessToken } = await ynabClientFactory(sessionToken);

  const budgets = await ynab.getBudgets(accessToken);
  return createResponse(200, { budgets });
};
