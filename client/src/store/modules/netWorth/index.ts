import { Module } from 'vuex';
import { NetWorthState } from './types';
import { RootState } from '@/store/types';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';

const state = {
  monthlyNetWorth: [],
  accounts: [],
};

const netWorth: Module<NetWorthState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default netWorth;
