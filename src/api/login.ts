import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { YNABClientInfo } from './types';
import YNAB from './ynab';

const config: YNABClientInfo = {
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  authRedirectUri: process.env.authRedirectUri,
  clientRedirectUri: process.env.clientRedirectUri,
};

export function handler(event: APIGatewayProxyEvent) {
  const ynab = new YNAB(config);

  const url = ynab.buildAuthorizeUrl();

  const response = {
    statusCode: 302,
    headers: {
      Location: url,
    },
  };

  return response;
}
