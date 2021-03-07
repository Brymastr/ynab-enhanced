import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { ClientConfig } from '../../util/Ynab';
import YNAB from '../../util/Ynab';
import Parameters from '../../util/ParameterStoreCache';

const parameterKeys = ['ClientId', 'ClientSecret'];
const parameters = new Parameters(parameterKeys, 'YNAB', 5000);

export const handler: APIGatewayProxyHandler = async event => {
  const host = `https://${event.headers.Host}/Prod`;
  const [clientId, clientSecret] = await parameters.get(parameterKeys);

  const config: ClientConfig = {
    clientId,
    clientSecret,
    authRedirectUri: `${host}/auth/ynab/token`,
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
