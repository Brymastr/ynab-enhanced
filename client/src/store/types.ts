import { YnabState } from './modules/ynab/types';
import { UserState } from './modules/user/types';
import { NetWorthState } from './modules/netWorth/types';

export interface RootState {
  ynab: YnabState;
  user: UserState;
  netWorth: NetWorthState;
}
