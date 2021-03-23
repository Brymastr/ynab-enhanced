import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse } from '../../util/helpers';
import SessionDatastore from '../../datastore/Session';

export const handler: APIGatewayProxyHandler = async event => {
  const sessionDatastore = new SessionDatastore();
  const valid = await sessionDatastore.verify(event.pathParameters.sessionToken);
  return createResponse(200, { valid });
};
