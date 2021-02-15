import { APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';

export default function createResponse(code: number, body: Record<string, any>) {
  const response: APIGatewayProxyResult = {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': '*',
    },
    body: JSON.stringify(body),
  };

  return response;
}
