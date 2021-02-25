import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse } from '../../util/helpers';

export const handler: APIGatewayProxyHandler = async (event, context) => {
  return createResponse(200, { message: 'Logout' });
};
