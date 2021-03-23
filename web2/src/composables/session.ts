import isBefore from 'date-fns/isBefore';
import { computed, reactive, readonly } from 'vue';
import useYnab from './ynab';
import router from '@/router';
import { verifySession } from '@/api/session';
const { clearState: clearYnabState } = useYnab();

const namespace = 'session';

interface State {
  token: string | null;
  expiration: number | null;
}

type StateKey = keyof State;
type GetType = string | number | null;

interface GetConstructor<T extends GetType> {
  (value: any): T;
}

function get<T extends GetType>(key: StateKey, defaultValue: T, cast: GetConstructor<T>) {
  const item = localStorage.getItem(`${namespace}/${key}`);

  let result: T;
  if (item === null) result = cast(defaultValue);
  else result = cast(item);

  return result;
}

const defaultState: State = {
  token: get('token', null, String),
  expiration: get('expiration', null, Number),
};

const state = reactive(defaultState);

function set(key: StateKey) {
  const value = state[key];
  if (value === null) localStorage.removeItem(`${namespace}/${key}`);
  else if (typeof value === 'string') localStorage.setItem(`${namespace}/${key}`, value);
  else localStorage.setItem(`${namespace}/${key}`, JSON.stringify(value));
}

const getToken = computed(() => state.token);
const getExpiration = computed(() => state.expiration);

function setToken(token: string | null) {
  state.token = token;
  set('token');
}

function setExpiration(expiration: number | null) {
  state.expiration = expiration;
  set('expiration');
}

async function verify() {
  // token and expiration exist
  const { token, expiration } = state;
  if (token === null || expiration === null) return false;

  // local expiration is valid
  const validExpiration = isBefore(new Date(), new Date(expiration));
  if (!validExpiration) return false;

  // check session against server
  const validToken = await verifySession(token);
  if (!validToken) return false;

  // all checks out
  return true;
}

function clearState() {
  setToken(null);
  setExpiration(null);
}

function logout() {
  clearState();
  clearYnabState();
  router.replace({ name: 'Landing' });
}

export default function useSession() {
  return {
    state: readonly(state),
    getToken,
    getExpiration,
    verify,
    clearState,
    setToken,
    setExpiration,
    logout,
  };
}
