import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse } from '../../util/helpers';
import { ClientConfig } from 'src/util/Ynab';
import YNAB from '../../util/Ynab';
import Parameters from '../../util/ParameterStoreCache';

const parameterKeys = ['ClientId', 'ClientSecret'];
const parameters = new Parameters(parameterKeys, 'YNAB', 5000);

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const [clientId, clientSecret] = await parameters.get(parameterKeys);

  const config: ClientConfig = {
    clientId,
    clientSecret,
    authRedirectUri: 'http://localhost:3000/auth/token',
    clientRedirectUri: 'http://localhost:3000/auth/login',
  };

  const ynab = new YNAB(config);

  const accessToken = event.headers.access_token;

  const budgets = await ynab.getBudgets(accessToken);
  return createResponse(200, { budgets });
};
