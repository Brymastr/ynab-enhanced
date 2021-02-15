import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import createResponse from './create-response';

export const handler: APIGatewayProxyHandler = async (event, context) => {
  return createResponse(200, { message: 'Token' });
};
