import { computed, reactive, readonly } from 'vue';

interface State {
  token: string | null;
  expiration: number | null;
}

const defaultState: State = {
  token: null,
  expiration: null,
};

const state = reactive(defaultState);

const getToken = computed(() => state.token);

function setToken(token: string) {
  state.token = token;
}

function setExpiration(expiration: number) {
  state.expiration = expiration;
}

function logout() {
  console.log('logout');
}

export default function useSession() {
  return { state: readonly(state), getToken, setToken, setExpiration, logout };
}
