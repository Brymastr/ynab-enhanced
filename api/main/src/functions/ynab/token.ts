import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { ClientConfig } from '../../util/Ynab';
import YNAB from '../../util/Ynab';
import Parameters from '../../util/ParameterStoreCache';
import YnabDatastore, { Schema, Tokens } from '../../datastore/Ynab';
import SessionDatastore from '../../datastore/Session';
import UserDatastore from '../../datastore/User';

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
    authRedirectUri: `${host}/auth/token`,
  };

  const ynab = new YNAB(config);

  const { access_token, refresh_token, token_type, expires_in } = await ynab.getAccessToken(code);

  const date = new Date();

  const tokens: Tokens = {
    AccessToken: access_token,
    RefreshToken: refresh_token,
    TokenType: token_type,
    Expiration: date.setSeconds(date.getSeconds() + expires_in),
  };

  // Check if user with this ynab user id exists
  const ynabUser = await ynab.getUser(tokens.AccessToken);

  const ynabDatastore = new YnabDatastore();
  const sessionDatastore = new SessionDatastore();

  const existingUser = await ynabDatastore.getByYnabUserId(ynabUser.id);

  let sessionToken: string, sessionExpiration: number, userId: string;

  if (existingUser) {
    // User exists, update the ynab and session values
    const [session] = await Promise.all([
      sessionDatastore.set(existingUser.HashKey),
      ynabDatastore.set(existingUser.HashKey, tokens),
    ]);
    sessionToken = session.token;
    sessionExpiration = session.expiration;
    userId = existingUser.HashKey;
  } else {
    // User doesn't exist and should be created
    const userDatastore = new UserDatastore();
    userId = await userDatastore.create();
    const session = await sessionDatastore.set(userId);
    sessionToken = session.token;
    sessionExpiration = session.expiration;
  }

  const result = await ynabDatastore.set(userId, tokens);

  return {
    statusCode: 302,
    headers: {
      Location: clientRedirectUri,
      'wealth-session-token': sessionToken,
      'wealth-session-expiration': sessionExpiration,
      'wealth-user-id': userId,
    },
    body: '',
  };
};
