import { APIGatewayProxyEvent } from 'aws-lambda';
import SessionDatastore from 'datastore/Session';

export interface Result {
  budgetId?: string;
  accountId?: string;
  sessionToken: string;
}

function getTokenHeader(headers: { [name: string]: string }) {
  return headers['wealth-session-token'] ?? headers['Wealth-Session-Token'];
}

export default async function sessionMiddleware(event: APIGatewayProxyEvent) {
  if (!event) throw { code: 400, message: 'Missing event parameter' };

  const sessionToken = getTokenHeader(event.headers);
  if (!sessionToken) throw { code: 401, message: 'Missing session token' };

  const sessionDatastore = new SessionDatastore();
  const validSession = await sessionDatastore.verify(sessionToken);
  if (!validSession) throw { code: 401, message: 'Invalid session token' };

  const budgetId = event.pathParameters?.budget_id ?? null;
  const accountId = event.pathParameters?.account_id ?? null;

  return { budgetId, accountId, sessionToken };
}
