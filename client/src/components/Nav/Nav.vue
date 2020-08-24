<template>
  <nav
    class="fixed top-0 h-header w-full transition-height duration-300 ease-in-out bg-gray-800 text-gray-300 font-thin"
    :class="{ visible: navPage !== null }"
  >
    <!-- top left -->
    <div class="nav-top h-header" :class="{ invisible: !selectedBudgetId }">
      <NavItem :click="setNavPage.bind(this, 'settings')" :selected="navPage === 'settings'"
        >Settings</NavItem
      >
      <NavItem :click="setNavPage.bind(this, 'budgets')" :selected="navPage === 'budgets'"
        >Budgets</NavItem
      >
    </div>

    <!-- title -->
    <Title class="nav-top h-header" :class="{ invisible: navPage !== null }" />

    <!-- top right -->
    <div class="right nav-top h-header">
      <ReloadIcon
        class="reload"
        id="asdf"
        :rotate="loadingNetWorthStatus === 'loading'"
        :ready="loadingNetWorthStatus === 'ready'"
        :action="loadNetWorth"
        :small="true"
        v-if="navPage === null"
      />
      <ReloadIcon
        class="reload"
        id="asdff"
        :rotate="loadingForecastStatus === 'loading'"
        :ready="loadingForecastStatus === 'ready'"
        :action="loadForecast"
        :small="true"
        v-if="navPage === null"
      />
      <NavItem :click="logout" side="right">Logout</NavItem>
    </div>

    <!-- main content -->
    <div class="content mx-auto col-span-3">
      <BudgetSelect v-if="navPage === 'budgets'" v-on:done="setNavPage('budgets')" />
      <Settings v-else-if="navPage === 'settings'" v-on:done="setNavPage('settings')" />
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import BudgetSelect from '@/components/Nav/BudgetSelect.vue';
import Settings from '@/components/Nav/Settings.vue';
import Title from '@/components/Nav/Title.vue';
import { LoadingStatus } from '../../store/modules/ynab/types';
import ReloadIcon from '@/components/Icons/ReloadIcon.vue';
import NavItem from '@/components/Nav/NavTopItem.vue';
const ynabNS = 'ynab';
const userNS = 'user';

type NavPage = 'budgets' | 'settings' | null;

@Component({
  components: { BudgetSelect, Settings, Title, ReloadIcon, NavItem },
})
export default class Nav extends Vue {
  @State('loadingNetWorthStatus', { namespace: ynabNS })
  private loadingNetWorthStatus!: LoadingStatus;
  @State('loadingForecastStatus', { namespace: ynabNS })
  private loadingForecastStatus!: LoadingStatus;
  @State('selectedBudgetId', { namespace: ynabNS }) private selectedBudgetId!: string;
  @Action('logout', { namespace: userNS }) private logout!: Function;
  @Action('loadNetWorth', { namespace: ynabNS }) private loadNetWorth!: Function;
  @Action('loadForecast', { namespace: ynabNS }) private loadForecast!: Function;

  private navPage: NavPage = 'budgets';

  setNavPage(page: NavPage) {
    if (this.navPage === page) this.navPage = null;
    else this.navPage = page;
  }

  mounted() {
    if (this.selectedBudgetId !== null) this.navPage = null;
  }
}
</script>

<style lang="scss">
nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: min-content auto min-content;
}

nav.visible {
  height: 100%;
}

nav .routing {
  justify-self: start;
}

nav .right {
  justify-self: end;
}

nav .nav-top {
  display: flex;
  align-items: stretch;
  white-space: nowrap;
}

nav .content {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
