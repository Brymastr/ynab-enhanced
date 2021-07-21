import SessionDatastore from 'datastore/Session';
import { RequestObjectProperty, Result as ApiGatewayParsedResult } from './apiGateway';

export interface Result {
  sessionToken: string;
  body: Record<string, string | number | boolean> | null;
  pathParameters: RequestObjectProperty;
  queryStringParameters: RequestObjectProperty;
}

function getTokenHeader(headers: RequestObjectProperty) {
  return headers['wealth-session-token'] ?? headers['Wealth-Session-Token'];
}

export default async function sessionMiddleware(input: ApiGatewayParsedResult): Promise<Result> {
  const { body, headers, pathParameters, queryStringParameters } = input;

  const sessionToken = getTokenHeader(headers);
  if (!sessionToken) throw { code: 401, message: 'Missing session token' };

  const sessionDatastore = new SessionDatastore();
  const validSession = await sessionDatastore.verify(sessionToken);
  if (!validSession) throw { code: 401, message: 'Invalid session token' };

  return { sessionToken, pathParameters, queryStringParameters, body };
}
