import merge from 'deepmerge';

const namespace = 'wealthforynab';

let state: Record<string, any> = {};

function persist(k: string, v: any) {
  const s = state[k];
  state[k] = merge(s, v, { arrayMerge: (_, y) => y });
  console.log(state[k]);
  localStorage.setItem(namespace, JSON.stringify(state));
}

let hydrated = false;

function hydrate() {
  const x = localStorage.getItem(namespace);
  if (x === null) return;
  state = JSON.parse(x);
  hydrated = true;
}

function getModule<T>(x: string) {
  const y = state[x] as T;
  return y;
}

export default function useComposition() {
  if (!hydrated) hydrate();
  return { persist, hydrate, getModule };
}
