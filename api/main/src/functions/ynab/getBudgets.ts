import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse, ynabClientFactory } from '../../util/helpers';
import SessionDatastore from '../../datastore/Session';

export const handler: APIGatewayProxyHandler = async event => {
  const sessionToken = event.headers['wealth-session-token'];
  if (!sessionToken) return createResponse(401, { message: 'Missing session token' });

  const sessionDatastore = new SessionDatastore();
  const validSession = await sessionDatastore.verify(sessionToken);
  if (!validSession) return createResponse(401, { message: 'Invalid session token' });

  const { ynab, accessToken } = await ynabClientFactory(sessionToken);

  const budgets = await ynab.getBudgets(accessToken);
  return createResponse(200, budgets);
};
