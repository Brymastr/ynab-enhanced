import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { ClientConfig } from '../../util/Ynab';
import YNAB from '../../util/Ynab';
import Parameters from '../../util/ParameterStoreCache';
import YnabDatastore, { Schema as YnabSchema, Tokens } from '../../datastore/Ynab';
import InfoDatastore, { Schema as InfoSchema } from '../../datastore/Info';
import SessionDatastore, { Schema as SessionSchema } from '../../datastore/Session';
import { addSeconds } from 'date-fns';

const parameterKeys = ['ClientId', 'ClientSecret', 'ClientRedirectUri'];
const parameters = new Parameters(parameterKeys, 'YNAB', 5000);

export const handler: APIGatewayProxyHandler = async event => {
  const host = `https://${event.headers.Host}/Prod`;
  const { code } = event.queryStringParameters;

  // Get YNAB auth tokens
  const [clientId, clientSecret, clientRedirectUri] = await parameters.get([
    'ClientId',
    'ClientSecret',
    'ClientRedirectUri',
  ]);

  const config: ClientConfig = {
    clientId,
    clientSecret,
    clientRedirectUri,
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

  return {
    statusCode: 302,
    headers: {
      Location: `${clientRedirectUri}?sessionToken=${sessionResult.SessionToken}&sessionExpiration=${sessionResult.Expiration}`,
    },
    body: '',
  };
};
