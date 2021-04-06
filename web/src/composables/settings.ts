import { computed, reactive, readonly } from 'vue';
import useComposition from './base';
const namespace = 'settings';

const { persist, getModule } = useComposition();

interface State {
  brynab: boolean;
}

const defaultState: State = {
  brynab: false,
};

const state = reactive(defaultState);

function set() {
  persist(namespace, state);
}

function setBrynab(payload?: boolean) {
  state.brynab = payload ?? !state.brynab;
  set();
}

function getBrynab() {
  return computed(() => state.brynab);
}

function reset() {
  const x = getModule<State>(namespace);
  if (x?.brynab !== undefined) state.brynab = x?.brynab;
}

export default function useSettings() {
  return { state: readonly(state), setBrynab, getBrynab, reset };
}
