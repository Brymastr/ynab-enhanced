<template>
  <nav :class="{ visible: navPage !== null }">
    <!-- top left -->
    <div class="routing nav-top">
      <div @click="setNavPage('settings')" :class="{ selected: navPage === 'settings' }">
        Settings
      </div>
      <div @click="setNavPage('budgets')" :class="{ selected: navPage === 'budgets' }">Budgets</div>
    </div>

    <!-- top right -->
    <div class="logout nav-top">
      <div @click="logout">Logout</div>
    </div>

    <!-- main content -->
    <div class="content">
      <BudgetSelect v-if="navPage === 'budgets'" v-on:done="setNavPage('budgets')" />
      <Settings v-else-if="navPage === 'settings'" v-on:hide="setNavPage" v-on:show="setNavPage" />
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import BudgetSelect from '@/components/BudgetSelect.vue';
import Settings from '@/components/Settings.vue';
const ynabNS = 'ynab';
const userNS = 'user';

type NavPage = 'budgets' | 'settings' | null;

@Component({
  components: { BudgetSelect, Settings },
})
export default class Nav extends Vue {
  @State('selectedBudgetId', { namespace: ynabNS }) private selectedBudgetId!: string;
  @Action('logout', { namespace: userNS }) private logout!: Function;

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

<style scoped lang="scss">
nav {
  background-color: var(--primary-color);
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  width: 100%;
  transition: height 300ms ease;

  display: grid;
  grid-template-columns: min-content 1fr min-content;
  grid-template-rows: min-content 1fr min-content;
  grid-template-areas:
    'top-left title top-right'
    'content content content'
    'bottom bottom bottom';

  height: var(--header-height);
}

nav.visible {
  height: 100%;
}

.routing {
  grid-area: top-left;
}

.logout {
  grid-area: top-right;

  > div {
    color: var(--font-color);
    font-size: 1em;
  }
}

.nav-top {
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

.content {
  margin-top: calc(var(--header-height) * -1);
  grid-area: content;

  display: flex;
  justify-content: center;
  align-items: center;
}

.selected {
  color: white;
}
</style>
