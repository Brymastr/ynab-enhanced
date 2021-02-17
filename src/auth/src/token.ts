import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { YNABClientConfig } from './util/types';
import YNAB from './util/Ynab';
import Parameters from './util/ParameterStoreCache';
import { parseTokens } from './util/helpers';
import SessionStore from './util/SessionStore';

const parameterKeys = ['ClientId', 'ClientSecret'];
const parameters = new Parameters(parameterKeys, 'YNAB', 5000);

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const { code } = event.pathParameters;

  const [clientId, clientSecret] = await parameters.get(parameterKeys);

  const config: YNABClientConfig = {
    clientId,
    clientSecret,
    authRedirectUri: 'http://localhost:3000/auth/token',
    clientRedirectUri: 'http://localhost:3000/auth/login',
  };

  const ynab = new YNAB(config);

  const tokenResponse = await ynab.getAccessToken(code);

  const sessionStore = new SessionStore();

  const tokens = parseTokens(tokenResponse);

  await sessionStore.set(tokens);

  return {
    statusCode: 302,
    headers: {
      Location: `${config.clientRedirectUri}`,
    },
    body: '',
  };
};
