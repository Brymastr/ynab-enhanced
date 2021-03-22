import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse, createPeriodicNetWorth, ynabClientFactory } from '../../util/helpers';

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const sessionToken = event.headers['wealth-session-token'];
  if (!sessionToken) return createResponse(401, { message: 'Invalid or missing session token' });

  const budgetId = event.pathParameters.budget_id;

  const { ynab, accessToken } = await ynabClientFactory(sessionToken);

  const transactions = await ynab.getTransactions(budgetId, accessToken);
  const monthlyNetWorth = createPeriodicNetWorth(transactions, 'month');

  return createResponse(200, monthlyNetWorth);
};
