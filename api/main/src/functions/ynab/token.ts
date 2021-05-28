import 'util/registration';

import { APIGatewayProxyEvent } from 'aws-lambda';
import { ClientConfig } from 'util/Ynab';
import YNAB from 'util/Ynab';
import Parameters from 'util/ParameterStoreCache';
import redirect, { Redirect } from '../middleware/redirect';
import { basicCatch } from 'src/util/catchers';
import Middleware from 'middleware/Middleware';
import { Tokens } from 'src/datastore/Ynab';
import { addSeconds } from 'date-fns';
import YnabDatastore, { Schema as YnabSchema } from 'datastore/Ynab';
import InfoDatastore, { Schema as InfoSchema } from 'datastore/Info';
import SessionDatastore, { Schema as SessionSchema } from 'datastore/Session';

const parameterKeys = ['ClientId', 'ClientSecret'];
const parameters = new Parameters(parameterKeys, 'YNAB', 5000);

async function main({ headers, queryStringParameters }: APIGatewayProxyEvent): Promise<Redirect> {
  const { Host } = headers;

  const host = `https://${Host}/Prod`;

  const { code, state } = queryStringParameters ?? {};

  // Get YNAB auth tokens
  const [clientId, clientSecret] = await parameters.get(['ClientId', 'ClientSecret']);

  const config: ClientConfig = {
    clientId,
    clientSecret,
    authRedirectUri: `${host}/auth/ynab/token`,
  };

  const ynab = new YNAB(config);

  const { access_token, refresh_token, token_type, expires_in } = await ynab.getAccessToken(code);

  const date = new Date();

  const tokens: Tokens = {
    AccessToken: access_token,
    RefreshToken: refresh_token,
    TokenType: token_type,
    Expiration: +addSeconds(date, expires_in),
  };

  // Check if user with this ynab user id exists
  const ynabUser = await ynab.getUser(tokens.AccessToken);

  const ynabDatastore = new YnabDatastore();
  const infoDatastore = new InfoDatastore();
  const sessionDatastore = new SessionDatastore();

  // upsert ynab, return hashkey
  const ynabUpsertSchema: YnabSchema = {
    UserId: ynabUser.id,
    ...tokens,
  };
  const upsertYnabResult = await ynabDatastore.upsert(ynabUpsertSchema);

  // upsert info and session
  const infoUpsertSchema: InfoSchema = {
    HashKey: upsertYnabResult.HashKey,
  };
  const sessionUpsertSchema: SessionSchema = {
    HashKey: upsertYnabResult.HashKey,
  };
  const [infoResult, sessionResult] = await Promise.all([
    infoDatastore.upsert(infoUpsertSchema),
    sessionDatastore.upsert(sessionUpsertSchema),
  ]);

  const redirectUri = state + 'login';
  const locationParts = [
    `${redirectUri}?`,
    `sessionToken=${sessionResult.SessionToken}`,
    `sessionExpiration=${sessionResult.Expiration}`,
  ];

  return { location: locationParts.join('&') };
}

// prettier-ignore
export const handler = new Middleware()
  .pipe(main)
  .pipe(redirect)
  .catch(basicCatch)
  .handler();
