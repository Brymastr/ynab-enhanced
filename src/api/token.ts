import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { TokenResponse, Tokens, YNABClientInfo } from './types';
import { add, format } from 'date-fns';
import YNAB from './ynab';

const config: YNABClientInfo = {
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  authRedirectUri: process.env.authRedirectUri,
  clientRedirectUri: process.env.clientRedirectUri,
};

export async function handler(event: APIGatewayProxyEvent) {
  const ynab = new YNAB(config);

  const { code } = event.queryStringParameters;

  if (!code)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing code' }),
    };

  const tokenResponse = await ynab.getAccessToken(code);

  const tokens = parseTokens(tokenResponse);

  // req.session.tokens = tokens;

  // req.session.save(_ => {
  //   res.redirect(302, `${config.clientRedirectUri}?session_id=${req.session.id}`);
  // });

  const response = {
    statusCode: 302,
    headers: {
      Location: config.clientRedirectUri,
    },
  };

  return response;
}

function parseTokens(tokenResponse: TokenResponse): Tokens {
  const { access_token, refresh_token, expires_in } = tokenResponse;

  const expiryDate = add(new Date(), { seconds: expires_in });

  const tokens: Tokens = {
    access_token,
    refresh_token,
    expires_at: format(expiryDate, 'X'),
  };

  return tokens;
}
