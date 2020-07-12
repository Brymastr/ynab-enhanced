<template>
  <div class="net-worth">
    <h1>This is the Net Worth page</h1>
    <MonthlyNetWorth />
    <Accounts />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import MonthlyNetWorth from '@/components/MonthlyNetWorth.vue';
import Accounts from '@/components/Accounts.vue';
const namespace = 'netWorth';

@Component({
  components: {
    MonthlyNetWorth,
    Accounts,
  },
})
export default class HelloWorld extends Vue {
  @Action('getAccounts', { namespace }) private getAccounts: Function;
  @Action('getMonthlyNetWorth', { namespace }) private getMonthlyNetWorth: Function;

  async mounted() {
    await this.getMonthlyNetWorth();
    await this.getAccounts();
  }
}
</script>
