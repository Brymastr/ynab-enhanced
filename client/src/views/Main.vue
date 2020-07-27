<template>
  <div>
    <Nav />
    <div class="header-fix"></div>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import Nav from '@/components/Nav.vue';
const namespace = 'ynab';

@Component({
  components: { Nav },
})
export default class Main extends Vue {
  @Action('getBudgets', { namespace }) private getBudgets!: Function;
  @Action('getAccounts', { namespace }) private getAccounts!: Function;
  @Action('getMonthlyNetWorth', { namespace }) private getMonthlyNetWorth!: Function;

  sync() {
    Promise.all([this.getAccounts(), this.getMonthlyNetWorth()]);
  }
}
</script>

<style scoped lang="scss">
#app > div {
  --header-height: 54px;

  margin: 0;

  > .header-fix {
    height: var(--header-height);
  }
}
</style>
