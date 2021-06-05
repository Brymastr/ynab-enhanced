import 'util/registration';

import { APIGatewayProxyEvent } from 'aws-lambda';
import { ClientConfig } from 'util/Ynab';
import YNAB from 'util/Ynab';
import Parameters from 'util/ParameterStoreCache';
import redirect, { Redirect } from '../middleware/redirect';
import { basicCatch } from 'src/util/catchers';
import Middleware from 'middleware/Middleware';

const parameterKeys = ['ClientId', 'ClientSecret'];
const parameters = new Parameters(parameterKeys, 'YNAB', 5000);

async function main({ headers }: APIGatewayProxyEvent): Promise<Redirect> {
  const { Host, Referer: referer } = headers;

  const host = `https://${Host}/Prod`;

  const [clientId, clientSecret] = await parameters.get(parameterKeys);

  const config: ClientConfig = {
    clientId,
    clientSecret,
    authRedirectUri: `${host}/auth/ynab/token`,
  };

  const ynab = new YNAB(config);

  const location = ynab.buildAuthorizeUrl(referer);

  return { location };
}

// prettier-ignore
export const handler = new Middleware()
  .pipe(main)
  .pipe(redirect)
  .catch(basicCatch)
  .handler();
