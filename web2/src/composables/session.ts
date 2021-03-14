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

export default { state: readonly(state), getToken, setToken, setExpiration };
