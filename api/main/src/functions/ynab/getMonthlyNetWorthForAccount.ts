import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse, createPeriodicNetWorth } from '../../util/helpers';
import { ClientConfig } from 'src/util/Ynab';
import YNAB from '../../util/Ynab';
import Parameters from '../../util/ParameterStoreCache';

const parameterKeys = ['ClientId', 'ClientSecret'];
const parameters = new Parameters(parameterKeys, 'YNAB', 5000);

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const [clientId, clientSecret] = await parameters.get(parameterKeys);

  const config: ClientConfig = { clientId, clientSecret };

  const ynab = new YNAB(config);

  const accessToken = event.headers.access_token;
  const budgetId = event.pathParameters.budget_id;
  const accountId = event.pathParameters.account_id;

  const transactions = await ynab.getTransactionsByAccount(budgetId, accountId, accessToken);
  const monthlyNetWorth = createPeriodicNetWorth(transactions, 'month');

  return createResponse(200, { monthlyNetWorth });
};
