<template>
  <div class="net-worth">
    <h1>Net Worth</h1>
    <!-- <Accounts /> -->
    <!-- <MonthlyNetWorth v-if="months" :months="months" /> -->
    <MonthlyNetWorthGraph v-if="chartData" :chartData="chartData" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import MonthlyNetWorth from '@/components/MonthlyNetWorth.vue';
import MonthlyNetWorthGraph from '@/components/MonthlyNetWorthGraph.vue';
import { MonthlyNetWorth as MonthlyNetWorthType } from '../store/modules/netWorth/types';
import Accounts from '@/components/Accounts.vue';
const namespace = 'netWorth';

@Component({
  components: {
    MonthlyNetWorth,
    MonthlyNetWorthGraph,
    Accounts,
  },
})
export default class HelloWorld extends Vue {
  @State('months', { namespace }) private months: MonthlyNetWorthType;

  get chartData(): Record<string, any> {
    const data = {
      labels: Object.keys(this.months).map(x => x.substring(0, x.length - 3)),
      datasets: [
        {
          label: 'Net Worth',
          data: Object.values(this.months).map(x => x / 1000),
          fill: false,
          pointRadius: 10,
          pointHoverRadius: 15,
        },
      ],
    };

    return data;
  }
}
</script>

<style scoped></style>
