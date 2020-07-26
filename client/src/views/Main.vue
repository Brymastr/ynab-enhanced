<template>
  <main>
    <Nav />
    <div>
      <p>Main</p>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import Nav from '@/components/Nav.vue';
const netWorthNS = 'netWorth';
const ynabNS = 'ynab';

@Component({
  components: { Nav },
})
export default class Main extends Vue {
  @Action('getBudgets', { namespace: ynabNS }) private getBudgets: Function;
  @Action('getAccounts', { namespace: ynabNS }) private getAccounts: Function;
  @Action('getMonthlyNetWorth', { namespace: netWorthNS }) private getMonthlyNetWorth: Function;

  // mounted() {}

  sync() {
    Promise.all([this.getAccounts(), this.getMonthlyNetWorth()]);
  }
}
</script>

<style scoped lang="scss">
main > div > p {
  margin: 0;
}
</style>
