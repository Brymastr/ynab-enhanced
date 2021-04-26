import { computed, reactive, readonly } from 'vue';
import useComposition from './base';
const namespace = 'settings';

const { persist, getModule } = useComposition();

interface State {
  brynab: boolean;
  dummy: boolean;
}

const defaultState: State = {
  brynab: false,
  dummy: false,
};

const state = reactive(defaultState);

function set() {
  persist(namespace, state);
}

const getBrynab = computed(() => state.brynab);

function setBrynab(payload?: boolean) {
  state.brynab = payload ?? !state.brynab;
  set();
}

const isDummy = computed(() => state.dummy);

function setDummy(payload?: boolean) {
  state.dummy = payload ?? !state.dummy;
  set();
}

function reset() {
  const x = getModule<State>(namespace);
  if (x?.brynab !== undefined) state.brynab = x?.brynab;
  if (x?.dummy !== undefined) state.dummy = x?.dummy;
}

export default function useSettings() {
  return { state: readonly(state), setBrynab, getBrynab, reset, isDummy, setDummy };
}
