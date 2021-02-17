import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { YNABClientConfig } from './util/types';
import YNAB from './util/Ynab';
import Parameters from './util/ParameterStoreCache';

const parameterKeys = ['ClientId', 'ClientSecret'];
const parameters = new Parameters(parameterKeys, 'YNAB', 5000);

export const handler: APIGatewayProxyHandler = async () => {
  const [clientId, clientSecret] = await parameters.get(parameterKeys);

  const config: YNABClientConfig = {
    clientId,
    clientSecret,
    authRedirectUri: 'http://localhost:3000/auth/token',
    clientRedirectUri: 'http://localhost:3000/auth/login',
  };

  const ynab = new YNAB(config);

  const url = ynab.buildAuthorizeUrl();

  const response = {
    statusCode: 302,
    headers: {
      Location: url,
    },
    body: '',
  };

  return response;
};
