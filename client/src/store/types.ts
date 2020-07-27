import { YnabState } from './modules/ynab/types';
import { UserState } from './modules/user/types';

export interface RootState {
  ynab: YnabState;
  user: UserState;
}
