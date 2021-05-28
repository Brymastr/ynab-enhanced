import moment from 'moment';
import axios from 'axios';
import YNAB, { WorthDate, TokenResponse, Transaction, PeriodicTransactions, ClientConfig } from './Ynab';
import { Granularity } from './types';
import { APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { Tokens } from 'datastore/Ynab';
import { getUnixTime } from 'date-fns';
import SessionDatastore from '../datastore/Session';
import YnabDatastore, { Schema as YnabSchema } from '../datastore/Ynab';
import Parameters from '../util/ParameterStoreCache';

const parameterKeys = ['ClientId', 'ClientSecret'];
const parameters = new Parameters(parameterKeys, 'YNAB', 5000);

const sessionStore = new SessionDatastore();
const ynabDatastore = new YnabDatastore();

/**
 * Given a list of transactions calculate current net worth at the end of each time period specified by `granularity`
 * Ex: return the net worth at the end of each month
 */
export function createPeriodicNetWorth(allTransactions: Transaction[], granularity: Granularity) {
  const worthList: WorthDate[] = [];
  // group transactions by date according to granularity
  const periodicTransactions = groupTransactionsByDate(allTransactions, granularity);
  // sort the resuling Map so the keys are ordered by date
  const sortedPeriodicTransactions = sortDates(periodicTransactions);

  let previous: WorthDate;
  for (const [date, transactions] of sortedPeriodicTransactions) {
    // total all transactions in the current period
    const transactionsTotal = transactions.map(({ amount }) => amount).reduce((a, c) => a + c, 0) / 1000;

    // calculate the current net worth on top of the previous period's net worth
    const worth = +((previous?.worth ?? 0) + transactionsTotal).toFixed(2);
    // create the new net worth item
    const newWorthDate: WorthDate = { date, worth, previous };
    worthList.push(newWorthDate);

    // reasign previous to this instance so that next iteration can reference this iteration
    previous = { date, worth };
  }

  return worthList;
}

/**
 * Group a list of transactions by a given time period
 * Ex: Group all individual transactions by month
 *   {
 *     '2021-01-31': [
 *       { id: '1', date: '2021-01-31', amount: 101000 },
 *       { id: '2', date: '2021-01-31', amount: 102000 },
 *       { id: '3', date: '2021-01-31', amount: 103000 },
 *     ],
 *     '2021-02-28': [
 *       { id: '4', date: '2021-02-28', amount: 104000 },
 *       { id: '5', date: '2021-02-28', amount: 105000 },
 *     ],
 *     '2021-03-31': [{ id: '6', date: '2021-03-31', amount: 106 }]
 *   }
 */
export function groupTransactionsByDate(transactions: Transaction[], granularity: Granularity) {
  const grouped: PeriodicTransactions = {};

  transactions.forEach(transaction => {
    const date = moment(transaction.date).endOf(granularity).format('YYYY-MM-DD');
    if (grouped[date] === undefined) grouped[date] = [];
    grouped[date].push(transaction);
  });

  return grouped;
}

/**
 * Sort the top level keys of an object
 */
export function sortDates(transactions: PeriodicTransactions): [string, Transaction[]][] {
  const unordered = new Map(Object.entries(transactions));
  const ordered = new Map([...unordered.entries()].sort());
  return Array.from(ordered.entries());
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

  const response = await axios.post<WorthDate[]>(`${process.env.forecastUrl}/forecast`, dailyNetWorth);

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

  if (!tokenValid) {
    const refreshedToken = await refreshYnabTokenAndSave(ynab, ynabDatastore, ynabSchema);
    ynabSchema = refreshedToken;
  }

  return { ynab, accessToken: ynabSchema.AccessToken };
}
