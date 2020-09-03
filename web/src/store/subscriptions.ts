import { MutationPayload, Store } from 'vuex';
import { RootState } from './types';
import { LoadingStatus } from './modules/ynab/types';

const loadingMutationNames = [
  'LoadingBudgets',
  'LoadingAccounts',
  'LoadingNetWorth',
  'LoadingForecast',
];
function onBudgetLoadingStatus(
  mutation: MutationPayload,
  state: RootState,
  store: Store<RootState>,
) {
  const {
    loadingAccountsStatus,
    loadingBudgetsStatus,
    loadingForecastStatus,
    loadingNetWorthStatus,
    loadingStatus,
  } = state.ynab;
  const list = [
    loadingAccountsStatus,
    loadingBudgetsStatus,
    loadingForecastStatus,
    loadingNetWorthStatus,
  ];
  const loading = !!list.find((x: LoadingStatus) => x === 'loading');

  if (loading || loadingStatus !== 'ready')
    store.commit('ynab/setLoading', loading ? 'loading' : 'ready');
}

function onMonthlyDataLoaded(mutation: MutationPayload, state: RootState, store: Store<RootState>) {
  if (mutation.payload === 'ready') return;

  const { loadingForecastStatus, loadingNetWorthStatus } = state.ynab;
  if (![loadingNetWorthStatus, loadingForecastStatus].includes('loading')) {
    store.dispatch('ynab/createDateList', state.ynab.selectedBudgetId);
  }
}

function includes(mutation: string, names: string[]) {
  return !!names.find(name => mutation.includes(name));
}

export default function subscribe(store: Store<RootState>) {
  store.subscribe((mutation: MutationPayload, state: RootState) => {
    // loading mutations
    if (includes(mutation.type, loadingMutationNames))
      onBudgetLoadingStatus(mutation, state, store);

    if (includes(mutation.type, ['LoadingNetWorth', 'LoadingForecast']))
      onMonthlyDataLoaded(mutation, state, store);
  });
}
