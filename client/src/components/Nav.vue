<template>
  <nav :class="{ hidden: !navVisible, visible: navVisible }">
    <!-- <router-link to="/"> Main </router-link>|
    <router-link to="/net-worth"> Net Worth </router-link>|
    <router-link to="/login"> Login </router-link> -->
    <div class="settings">Settings</div>

    <div class="content">
      <BudgetSelect />
    </div>

    <div class="logout">
      <button>Logout</button>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import BudgetSelect from '@/components/BudgetSelect.vue';
const ynabNS = 'ynab';

@Component({
  components: { BudgetSelect },
})
export default class Nav extends Vue {
  @State('selectedBudgetId', { namespace: ynabNS }) protected selectedBudgetId = false;
  @Action('getBudgets', { namespace: ynabNS }) private getAccounts: any;

  private navVisible = true;
}
</script>

<style scoped lang="scss">
nav {
  background-color: #5f87af;
  position: absolute;
  top: 0;
  left: 0;
  transition: height 300ms ease;
  overflow: hidden;
  width: 100%;

  display: grid;
  grid-template-areas:
    'top-left title top-right'
    'content content content'
    'bottom bottom bottom';
}

nav.hidden {
  height: 54px;
}

nav.visible {
  height: 100%;
}

.settings {
  grid-area: top-left;
}

.logout {
  grid-area: top-right;
}

.content {
  grid-area: content;

  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
