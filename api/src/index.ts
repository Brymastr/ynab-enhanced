import express from 'express';
import session from 'express-session';
import cors from 'cors';
import YNAB from './ynab';
import { Configuration, Tokens, WorthDate, Granularity } from './types';
import { createPeriodicNetWorth, parseTokens, getProjectedNetWorth } from './helpers';
import moment from 'moment';
import crypto from 'crypto';
const config: Configuration = {
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  authRedirectUri: process.env.authRedirectUri,
  clientRedirectUri: process.env.clientRedirectUri,
};

const ynab = new YNAB(config);

const app = express();
const port = 3000;

const corsWhitelist = ['http://localhost:8080', 'https://wealth.dorsay.dev'];
const corsOptions = {
  origin: function (origin: string, callback: Function) {
    if (corsWhitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
app.use(
  session({
    secret: crypto.randomBytes(8).toString(),
    saveUninitialized: true,
    resave: true,
    cookie: { secure: 'auto', httpOnly: false, sameSite: 'strict' },
  }),
);

async function main() {
  app.use((req, res, next) => {
    console.log('REQUEST:', req.method, req.originalUrl);
    next();
  });

  app.get('/api/login', (req, res) => {
    const url = ynab.buildAuthorizeUrl();
    res.redirect(302, url);
  });

  app.get('/api/auth/token', async (req, res) => {
    const { code } = req.query;
    if (typeof code !== 'string') return res.send(400);

    const tokenResponse = await ynab.getAccessToken(code);

    const tokens = parseTokens(tokenResponse);

    req.session.tokens = tokens;

    req.session.save(_ => {
      res.redirect(302, `${config.clientRedirectUri}?session_id=${req.session.id}`);
    });
  });

  app.post('/api/logout', async (req, res) => {
    req.session.destroy(() => res.sendStatus(200));
  });

  // middleware - check access_token
  app.use(async (req, res, next) => {
    const tokens: Tokens = req.session.tokens;

    if (process.env.NODE_ENV === 'local') {
      const tokens: Tokens = { access_token: process.env.token };
      req.session.tokens = tokens;
      return next();
    }
    if (!tokens) return res.redirect(302, config.clientRedirectUri);

    const now = moment();
    const expiresAt = moment.unix(parseInt(tokens.expires_at));

    console.log('SESSION:', req.session.id, 'EXPIRES AT:', expiresAt.toISOString());

    if (now.isAfter(expiresAt)) {
      console.log('REFRESHING TOKEN...');

      const { refresh_token } = req.session.tokens;

      const tokenResponse = await ynab.refreshAccessToken(refresh_token);

      req.session.tokens = parseTokens(tokenResponse);
    }

    next();
  });

  app.get('/api/budgets', async (req, res) => {
    const { access_token } = req.session.tokens;
    const budgets = await ynab.getBudgets(access_token);

    return res.send(budgets);
  });

  app.get('/api/budgets/:budget_id/accounts', async (req, res) => {
    const { access_token } = req.session.tokens;
    const accounts = await ynab.getAccounts(req.params.budget_id, access_token);

    return res.send(accounts);
  });

  // app.get('/api/budgets/:budget_id/accounts/:account_id/netWorth', async (req, res) => {
  //   const { budget_id, account_id } = req.params;
  //   const { access_token } = req.session.tokens;
  //   const date = <string>req.query.date;

  //   const transactions = await ynab.getTransactionsByAccount(budget_id, account_id, access_token);

  //   const balance = worthAtDate(transactions, date);

  //   return res.send({ balance });
  // });

  app.get('/api/budgets/:budget_id/accounts/:account_id/monthlyNetWorth', async (req, res) => {
    const { budget_id, account_id } = req.params;
    const { access_token } = req.session.tokens;

    const transactions = await ynab.getTransactionsByAccount(budget_id, account_id, access_token);

    const monthlyNetWorth = createPeriodicNetWorth(transactions, 'month');

    return res.send(monthlyNetWorth);
  });

  // app.get('/api/budgets/:budget_id/netWorth', async (req, res) => {
  //   const { budget_id } = req.params;
  //   const { access_token } = req.session.tokens;
  //   const date = <string>req.query.date;

  //   const transactions = await ynab.getTransactions(budget_id, access_token);

  //   const balance = worthAtDate(transactions, date);

  //   return res.send({ balance });
  // });

  app.get('/api/budgets/:budget_id/monthlyNetWorth', async (req, res) => {
    const { budget_id } = req.params;
    const { access_token } = req.session.tokens;

    const transactions = await ynab.getTransactions(budget_id, access_token);
    const monthlyNetWorth = createPeriodicNetWorth(transactions, 'month');
    return res.send(monthlyNetWorth);
  });

  app.get('/api/budgets/:budget_id/dailyNetWorth', async (req, res) => {
    const { budget_id } = req.params;
    const { access_token } = req.session.tokens;

    const dailyNetWorth = await getDailyNetWorth(budget_id, access_token);

    return res.send(dailyNetWorth);
  });

  app.get('/api/budgets/:budget_id/forecast', async (req, res) => {
    const { budget_id } = req.params;
    const { granularity = 'month' } = req.query;
    const { access_token } = req.session.tokens;

    const dailyNetWorth = await getDailyNetWorth(budget_id, access_token);

    const projectedNetWorth = await getProjectedNetWorth(dailyNetWorth);

    const result = granularity !== 'day' ? dailyToOther(projectedNetWorth) : projectedNetWorth;

    return res.send(result);
  });

  app.listen(port, () => console.log(`started on ${port}`));
}

async function getDailyNetWorth(budget_id: string, access_token: string) {
  const transactions = await ynab.getTransactions(budget_id, access_token);

  const dailyNetWorth = createPeriodicNetWorth(transactions, 'day');

  return dailyNetWorth;
}

function dailyToOther(dailyNetWorth: WorthDate[], granularity: Granularity = 'month') {
  return dailyNetWorth.filter(day => {
    const thisDate = moment(day.date).format('YYYY-MM-DD');
    const endOfMonth = moment(day.date).endOf(granularity).format('YYYY-MM-DD');
    return thisDate === endOfMonth;
  });
}

main();