import { APIGatewayProxyEvent } from 'aws-lambda';

export type RequestObjectProperty = { [name: string]: string };

export interface Result {
  body: Record<string, string | number | boolean> | null;
  headers: RequestObjectProperty;
  pathParameters: RequestObjectProperty;
  queryStringParameters: RequestObjectProperty;
}

export default async function apiGatewayMiddleware(event: APIGatewayProxyEvent): Promise<Result> {
  if (!event) throw { code: 400, message: 'Missing event parameter' };

  const pathParameters = event.pathParameters ?? {};
  const queryStringParameters = event.queryStringParameters ?? {};
  const headers = event.headers ?? {};
  const body: Record<string, string | number | boolean> | null =
    (event.body && JSON.parse(event.body)) || null;

  return { body, headers, pathParameters, queryStringParameters };
}
