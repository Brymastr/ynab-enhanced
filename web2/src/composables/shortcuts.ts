import { computed, reactive, readonly } from 'vue';
import useYnab from './ynab';
import useSession from './session';

interface State {
  keylog: string[];
}

const defaultState: State = {
  keylog: [],
};

const state = reactive(defaultState);

const {} = useYnab();
const {} = useSession();

function updateKeylog(key: string) {
  if (state.keylog.length > 20) state.keylog.shift();
  state.keylog.push(key.toLowerCase());

  const joined = state.keylog.join('');

  if (joined.slice(-5) === 'reset') {
    resetTyped();
  } else if (joined.slice(-5) === 'hello') {
    console.log('hello');
  }
}

window.addEventListener('keypress', e => updateKeylog(e.key));

function resetTyped() {
  console.log('reset typed');
}

export default function useShortcuts() {
  return { state: readonly(state) };
}
