import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';
import user from './modules/user';
import ynab from './modules/ynab';
import shortcuts from './modules/shortcuts';
import settings from './modules/settings';
import subscribe from './subscriptions';

const vuexPersist = new VuexPersist({
  key: 'wealth-for-ynab',
});

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    ynab,
    shortcuts,
    settings,
  },
  plugins: [vuexPersist.plugin],
});

subscribe(store);

export default store;
