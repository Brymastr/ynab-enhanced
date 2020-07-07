import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';
import netWorth from './modules/netWorth';

const vuexPersist = new VuexPersist({
  key: 'ynab-analytics',
});

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    netWorth,
  },
  plugins: [vuexPersist.plugin],
});
