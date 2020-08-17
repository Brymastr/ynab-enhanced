<template>
  <nav :class="{ visible: navPage !== null }">
    <!-- top left -->
    <div class="routing nav-top">
      <div @click="setNavPage('settings')" :class="{ selected: navPage === 'settings' }">
        Settings
      </div>
      <div @click="setNavPage('budgets')" :class="{ selected: navPage === 'budgets' }">Budgets</div>
    </div>

    <!-- title -->
    <Title class="nav-top" v-if="navPage === null" />

    <!-- top right -->
    <div class="right nav-top">
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
      <div @click="logout">Logout</div>
    </div>

    <!-- main content -->
    <div class="content">
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
const ynabNS = 'ynab';
const userNS = 'user';

type NavPage = 'budgets' | 'settings' | null;

@Component({
  components: { BudgetSelect, Settings, Title, ReloadIcon },
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
  background-color: var(--primary-color);
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  width: 100%;
  transition: height 300ms ease;
  height: var(--header-height);

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: min-content 1fr min-content;
  grid-template-areas:
    'top-left title top-right'
    'content content content'
    'bottom bottom bottom';
}

nav.visible {
  height: 100%;
}

nav .routing {
  grid-area: top-left;
}

nav .right {
  grid-area: top-right;
  justify-self: end;
}

nav .nav-top {
  height: var(--header-height);
  display: flex;
  flex-direction: row;
  align-items: stretch;
  white-space: nowrap;

  > * {
    margin: 0 15px;
    display: flex;
    align-items: center;
    transition: color 200ms ease-out;
    cursor: pointer;

    &:hover {
      color: white;
    }
  }
}

nav .content {
  margin-top: calc(var(--header-height) * -1);
  grid-area: content;

  display: flex;
  justify-content: center;
  align-items: center;
}

nav .selected {
  color: white;
}
</style>
