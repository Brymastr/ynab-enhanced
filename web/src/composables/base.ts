import merge from 'deepmerge';

const namespace = 'wealthforynab';

let state: Record<string, any> = {};

function persist(k: string, v: any) {
  const s = state[k];
  state[k] = merge(s, v, { arrayMerge: (_, y) => y });
  localStorage.setItem(namespace, JSON.stringify(state));
}

function hydrate() {
  const x = localStorage.getItem(namespace);
  if (x === null) return;
  state = JSON.parse(x);
}

function getModule<T>(x: string) {
  const y = state[x] as T;
  return y;
}

export default function useComposition() {
  return { persist, hydrate, getModule };
}
