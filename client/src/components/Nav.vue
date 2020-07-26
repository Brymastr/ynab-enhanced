<template>
  <nav :class="{ hidden: !navVisible, visible: navVisible }">
    <!-- top left -->
    <div class="routing nav-top">
      <div>Settings</div>
      <div>Budgets</div>
      <router-link to="/net-worth" v-if="!navVisible">Net Worth</router-link>
    </div>

    <!-- main content -->
    <div class="content">
      <BudgetSelect />
      <Settings hidden />
    </div>

    <!-- top right -->
    <div class="logout nav-top">
      <div @click="logout">Logout</div>
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

@Component({
  components: { BudgetSelect, Settings },
})
export default class Nav extends Vue {
  @State('selectedBudgetId', { namespace: ynabNS }) private selectedBudgetId!: string;
  @Action('logout', { namespace: userNS }) private logout!: Function;

  private navVisible = true;
}
</script>

<style scoped lang="scss">
nav {
  background-color: #5f87af;
  position: absolute;
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

  --header-height: 54px;
}

nav.hidden {
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

  > * {
    margin: 0 15px;
  }

  > div {
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
</style>
