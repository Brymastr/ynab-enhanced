import { computed, reactive, readonly } from 'vue';

interface State {}

const defaultState: State = {};

const state = reactive(defaultState);

function setToken(token: string) {}

function setExpiration(expiration: number) {}

export default function() {
  return { state: readonly(state), setToken, setExpiration };
}
