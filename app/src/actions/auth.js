import { USER_FETCHED, ACCESS_TOKEN_FETCHED } from './actionTypes';
import { YNAB_OAUTH_URL, YNAB_CLIENT_ID, YNAB_REDIRECT_URI } from '../constants';
import { API } from 'ynab';


export const setUser = (user) => ({
  type: USER_FETCHED,
  user,
});

export const setAccessToken = (token) => ({
  type: ACCESS_TOKEN_FETCHED,
  token,
});

export function startOAuthFlow() {
  let ynab;
  return dispatch =>
    doOAuth()
      .then(accessToken => {
        dispatch(setAccessToken(accessToken));
        ynab = new API(accessToken);
        return ynab.user.getUser();
      })
      .then(result => {
        dispatch(setUser(result.data.user));
      });
};


async function doOAuth() {
  const url = `${YNAB_OAUTH_URL}?client_id=${YNAB_CLIENT_ID}&redirect_uri=${YNAB_REDIRECT_URI}&response_type=token`;
  const win = window.open(url, '_blank');
  win.focus();
  const accessToken = await waitForAccessToken(win);
  win.close();
  return accessToken;
}

async function waitForAccessToken(win) {
  let token = null;
  do {
    await wait();
    const matched = win.location.href.match(/#access_token=([^&]*)/);
    if (matched) token = matched[1];
  } while (token === null);

  return token;
}

function wait(ms = 100) {
  return new Promise(resolve => setTimeout(resolve, ms));
}