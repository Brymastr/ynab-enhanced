import moment from 'moment';
import axios from 'axios';
import YNAB, {
  WorthDate,
  TokenResponse,
  Transaction,
  PeriodicTransactions,
  ClientConfig,
} from './Ynab';
import { Granularity } from './types';
import { APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { Tokens } from 'src/datastore/Ynab';
import { getUnixTime } from 'date-fns';
import SessionDatastore from '../datastore/Session';
import YnabDatastore, { Schema as YnabSchema } from '../datastore/Ynab';
import Parameters from '../util/ParameterStoreCache';

const parameterKeys = ['ClientId', 'ClientSecret'];
const parameters = new Parameters(parameterKeys, 'YNAB', 5000);

const sessionStore = new SessionDatastore();
const ynabDatastore = new YnabDatastore();

export function createPeriodicNetWorth(allTransactions: Transaction[], granularity: Granularity) {
  const worthList: WorthDate[] = [];
  const periodicTransactions: PeriodicTransactions = {};

  allTransactions.forEach(transaction => {
    const date = moment(transaction.date).endOf(granularity).format('YYYY-MM-DD');
    if (periodicTransactions[date] === undefined) periodicTransactions[date] = [];
    periodicTransactions[date].push(transaction);
  });

  let previousWorth = 0;
  for (const [date, transactions] of Object.entries(periodicTransactions)) {
    const periodWorth = transactions.map(({ amount }) => amount).reduce((a, c) => a + c, 0) / 1000;
    const worth = +(previousWorth + periodWorth).toFixed(2);
    worthList.push({ date, worth });
    previousWorth += periodWorth;
  }

  return worthList;
}

export function parseYnabTokens(tokenResponse: TokenResponse): Tokens {
  const date = new Date();
  return {
    AccessToken: tokenResponse.access_token,
    RefreshToken: tokenResponse.refresh_token,
    TokenType: tokenResponse.token_type,
    Expiration: getUnixTime(date) + tokenResponse.expires_in / 1000,
  };
}

export async function getForecast(dailyNetWorth: WorthDate[]) {
  let result: WorthDate[];

  const response = await axios.post<WorthDate[]>(
    `${process.env.forecastUrl}/forecast`,
    dailyNetWorth,
  );

  result = response.data;

  return result;
}

export function createResponse(code: number, body: Record<string, any>) {
  const response: APIGatewayProxyResult = {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  return response;
}

export function wait() {
  return new Promise(resolve => setTimeout(resolve, 3000));
}

export async function refreshYnabTokenAndSave(
  client: YNAB,
  datastore: YnabDatastore,
  ynabTokens: YnabSchema,
) {
  const refreshedTokens = await client.refreshAccessToken(ynabTokens.RefreshToken);
  const date = new Date();
  const schema: YnabSchema = {
    HashKey: ynabTokens.HashKey,
    RangeKey: ynabTokens.RangeKey,
    UserId: ynabTokens.UserId,
    AccessToken: refreshedTokens.access_token,
    RefreshToken: refreshedTokens.refresh_token,
    TokenType: refreshedTokens.token_type,
    Expiration: getUnixTime(date) + refreshedTokens.expires_in / 1000,
  };

  return datastore.upsert(schema);
}

export async function ynabClientFactory(sessionToken: string) {
  const [clientId, clientSecret] = await parameters.get(parameterKeys);
  const user = await sessionStore.getUserBySession(sessionToken);
  let ynabSchema = await ynabDatastore.getByUserId(user.HashKey);

  const config: ClientConfig = { clientId, clientSecret };

  const ynab = new YNAB(config);

  const tokenValid = getUnixTime(new Date()) < ynabSchema.Expiration - 100;
  console.log('Token Valid?', tokenValid);

  if (!tokenValid) {
    const refreshedToken = await refreshYnabTokenAndSave(ynab, ynabDatastore, ynabSchema);
    ynabSchema = refreshedToken;
  }

  return { ynab, accessToken: ynabSchema.AccessToken };
}
