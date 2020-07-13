import express from 'express';
import cors from 'cors';
import { BudgetDetail, Account, TransactionDetail } from 'ynab';
import moment from 'moment';
import * as YNAB from 'ynab';
import { WorthDate } from './types';
const ynab = new YNAB.API(process.env.token);
const app = express();
const port = 3000;

app.use(cors());

async function main() {
  app.get('/budgets', async (req, res) => {
    const budgets = await ynab.budgets
      .getBudgets()
      .then(response =>
        response.data.budgets.map((b: BudgetDetail) => ({ id: b.id, name: b.name })),
      );

    return res.send(budgets);
  });

  app.get('/budgets/:budget_id/accounts', async (req, res) => {
    const accounts = await ynab.accounts.getAccounts(req.params.budget_id).then(response =>
      response.data.accounts.map((a: Account) => ({
        id: a.id,
        name: a.name,
      })),
    );

    return res.send(accounts);
  });

  app.get('/budgets/:budget_id/accounts/:account_id/netWorth', async (req, res) => {
    const { budget_id, account_id } = req.params;
    const date = <string>req.query.date;

    const transactionsResponse = await ynab.transactions.getTransactionsByAccount(
      budget_id,
      account_id,
    );

    const transactions = transactionsResponse.data.transactions;

    const balance = await worthAtDate(transactions, date);

    return res.send({ balance });
  });

  app.get('/budgets/:budget_id/accounts/:account_id/monthlyNetWorth', async (req, res) => {
    const { budget_id, account_id } = req.params;

    const transactionsResponse = await ynab.transactions.getTransactionsByAccount(
      budget_id,
      account_id,
    );

    const transactions = transactionsResponse.data.transactions;

    const monthlyNetWorth = createMonthlyNetWorth(transactions);

    return res.send(monthlyNetWorth);
  });

  app.get('/budgets/:budget_id/netWorth', async (req, res) => {
    const { budget_id } = req.params;
    const date = <string>req.query.date;

    const transactionsResponse = await ynab.transactions.getTransactions(budget_id);

    const transactions = transactionsResponse.data.transactions;

    const balance = await worthAtDate(transactions, date);

    return res.send({ balance });
  });

  app.get('/budgets/:budget_id/monthlyNetWorth', async (req, res) => {
    const { budget_id } = req.params;

    const transactionsResponse = await ynab.transactions.getTransactions(budget_id);

    const transactions = transactionsResponse.data.transactions;

    const monthlyNetWorth = createMonthlyNetWorth(transactions);

    return res.send(monthlyNetWorth);
  });

  app.listen(port, () => console.log(`started on ${port}`));
}

// prettier-ignore
function worthAtDate(transactions: TransactionDetail[], date: string = moment().format('YYYY-MM-DD')): number {

  const balance = transactions
    .filter(x => moment(x.date).isSameOrBefore(moment(date)))
    .map(x => x.amount)
    .reduce((a, c) => a + c, 0);

  return balance / 1000;
}

function createMonthlyNetWorth(transactions: TransactionDetail[]): WorthDate[] {
  const firstMonth = moment(transactions[0].date).endOf('month');
  const lastMonth = moment();
  const monthDifference = lastMonth.diff(firstMonth, 'months', true);
  const monthlyWorthList: WorthDate[] = [];

  for (let i = 0; i <= monthDifference + 1; i++) {
    const date = moment(firstMonth).add(i, 'months').endOf('month').format('YYYY-MM-DD');
    const worth = worthAtDate(transactions, date);
    monthlyWorthList.push({ date, worth });
  }

  return monthlyWorthList;
}

main();
