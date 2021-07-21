import axios from 'axios';
import { getUnixTime } from 'date-fns';
import YNAB, { WorthDate, Transaction, PeriodicTransactions } from './Ynab';
import { TokenResponse, ClientConfig } from './OAuth2Client';
import { Granularity } from './types';
import { APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import Parameters from '../util/ParameterStoreCache';
import SessionDatastore from '../datastore/Session';
import YnabDatastore, { Schema as YnabSchema, Tokens } from '../datastore/Ynab';

const parameterKeys = ['ClientId', 'ClientSecret'];
const parameters = new Parameters(parameterKeys, 'YNAB', 5000);

const sessionStore = new SessionDatastore();
const ynabDatastore = new YnabDatastore();

/**
 * Given a list of transactions calculate current net worth at the end of each time period specified by `granularity`
 * Ex: return the net worth at the end of each month
 */
export function createPeriodicNetWorth(
  allTransactions: Transaction[],
  granularity: Granularity,
  includePrevious = false,
) {
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
    const newWorthDate: WorthDate = { date, worth };
    // conditionally attach previous period to this period for easier comparison
    if (includePrevious) newWorthDate.previous = previous;

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

  const firstDate = endOf(getEarliestTransaction(transactions), granularity);
  const lastDate = endOf(add(getLatestTransaction(transactions), granularity), granularity);
  let currentDate = firstDate;

  while (format(currentDate) !== format(lastDate)) {
    grouped[format(currentDate)] = [];
    currentDate = endOf(add(currentDate, granularity), granularity);
  }

  transactions.forEach(transaction => {
    const transactionDate = new Date(transaction.date);
    const date = format(endOf(transactionDate, granularity));
    // if (grouped[date] === undefined) grouped[date] = [];
    grouped[date].push(transaction);
  });

  return grouped;
}

export function getEarliestTransaction(transactions: Transaction[]) {
  let earliest = '9999-01-01';
  for (const { date } of transactions) {
    if (date < earliest) earliest = date;
  }
  return new Date(earliest);
}

export function getLatestTransaction(transactions: Transaction[]) {
  let latest = '1970-01-01';
  for (const { date } of transactions) {
    if (date > latest) latest = date;
  }
  return new Date(latest);
}

export function endOf(date: Date, granularity: Granularity) {
  const [year, month, day] = date.toISOString().substring(0, 10).split('-');
  const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();

  let result: Date;
  switch (granularity) {
    case 'day':
      result = new Date(`${year}-${month}-${day}T23:59:59.999Z`);
      break;
    case 'month':
      result = new Date(`${year}-${month}-${daysInMonth}T23:59:59.999Z`);
      break;
    case 'year':
      result = new Date(`${year}-12-31T23:59:59.999Z`);
      break;
    default:
      result = date;
  }
  return result;
}

export function format(date: Date) {
  return date.toISOString().substring(0, 10);
}

interface DateParams {
  date: Date;
  year: string;
  month: string;
  day: string;
  time: string;
  daysInMonth: number;
  dayInt: number;
  monthInt: number;
  yearInt: number;
}

export function add(date: Date, granularity: Granularity = 'day') {
  const [year, month, day] = date.toISOString().substring(0, 10).split('-');
  const time = date.toISOString().substring(11);
  const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
  const dayInt = parseInt(day);
  const monthInt = parseInt(month);
  const yearInt = parseInt(year);
  const params: DateParams = {
    date,
    year,
    month,
    day,
    time,
    daysInMonth,
    dayInt,
    monthInt,
    yearInt,
  };

  let result: Date;
  if (granularity === 'day') result = addDay(params);
  else if (granularity === 'month') result = addMonth(params);
  else if (granularity === 'year') result = addYear(params);

  return result;
}

export function addDay(params: DateParams) {
  const { year, month, time, daysInMonth, dayInt, monthInt, yearInt } = params;

  let result: Date;
  if (dayInt < daysInMonth) {
    const nextDay = `${dayInt + 1}`.padStart(2, '0');
    result = new Date(`${year}-${month}-${nextDay}T${time}`);
  } else if (monthInt < 12) {
    const nextMonth = `${monthInt + 1}`.padStart(2, '0');
    result = new Date(`${year}-${nextMonth}-01T${time}`);
  } else {
    const nextYear = `${yearInt + 1}`.padStart(4, '0');
    result = new Date(`${nextYear}-01-01T${time}`);
  }
  return result;
}

export function addMonth(params: DateParams) {
  const { year, day, dayInt, time, daysInMonth, monthInt, yearInt } = params;

  let nextMonth: string;
  let nextYear = year;
  let nextDay = day;
  if (monthInt < 12) {
    nextMonth = `${monthInt + 1}`.padStart(2, '0');
  } else {
    nextMonth = '01';
    nextYear = `${yearInt + 1}`.padStart(4, '0');
  }

  const daysInNextMonth = new Date(parseInt(nextYear), parseInt(nextMonth), 0).getDate();
  if (dayInt > daysInNextMonth) nextDay = `${daysInNextMonth}`.padStart(2, '0');

  return new Date(`${nextYear}-${nextMonth}-${nextDay}T${time}`);
}

export function addYear(params: DateParams) {
  const { month, day, time, yearInt } = params;
  const nextYear = `${yearInt + 1}`.padStart(4, '0');
  return new Date(`${nextYear}-${month}-${day}T${time}`);
}

/**
 * Sort the top level keys of an object
 */
export function sortDates(transactions: PeriodicTransactions): [string, Transaction[]][] {
  const unordered = new Map(Object.entries(transactions));
  const ordered = new Map([...unordered.entries()].sort());
  return Array.from(ordered.entries());
}

export function parseOAuthTokens(tokenResponse: TokenResponse): Tokens {
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
