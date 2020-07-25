import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';
import netWorth from './modules/netWorth';
import user from './modules/user';
import ynab from './modules/ynab';
import shortcuts from './modules/shortcuts';

const vuexPersist = new VuexPersist({
  key: 'ynab-analytics',
});

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    netWorth,
    user,
    ynab,
    shortcuts,
  },
  plugins: [vuexPersist.plugin],
});
