import { reactive } from 'vue';
import useYnab from './ynab';
import useSession from './session';
import useSettings from './settings';

export interface State {
  keylog: string[];
}

const defaultState: State = {
  keylog: [],
};

const state = reactive(defaultState);

const {} = useYnab();
const {} = useSession();
const { setBrynab } = useSettings();

function resetTyped() {
  console.log('reset typed');
}

function helloTyped() {
  console.log('hello');
}

function brynabTyped() {
  setBrynab();
}

function updateKeylog(key: string) {
  if (state.keylog.length > 20) state.keylog.shift();
  state.keylog.push(key.toLowerCase());

  const joined = state.keylog.join('');

  if (joined.slice(-5) === 'reset') {
    resetTyped();
  } else if (joined.slice(-5) === 'hello') {
    helloTyped();
  } else if (joined.slice(-6) === 'brynab') {
    brynabTyped();
  }
}

export default function useShortcuts() {
  window.addEventListener('keypress', e => updateKeylog(e.key));
}
