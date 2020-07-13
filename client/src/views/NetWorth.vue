<template>
  <div class="net-worth">
    <h1>Net Worth</h1>
    <!-- <Accounts /> -->
    <!-- <MonthlyNetWorth v-if="months" :months="months" /> -->
    <div>{{ selectedMonth }}: {{ selectedWorth }}</div>
    <MonthlyNetWorthGraph
      v-if="chartData"
      :chartData="chartData"
      :monthlyNetWorth="monthlyNetWorth"
      v-on:hoverMonth="hoverMonth"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import MonthlyNetWorth from '@/components/MonthlyNetWorth.vue';
import MonthlyNetWorthGraph from '@/components/MonthlyNetWorthGraph.vue';
import { WorthDate } from '../store/modules/netWorth/types';
import Accounts from '@/components/Accounts.vue';
import moment from 'moment';
const namespace = 'netWorth';

@Component({
  components: {
    MonthlyNetWorth,
    MonthlyNetWorthGraph,
    Accounts,
  },
})
export default class HelloWorld extends Vue {
  @State('monthlyNetWorth', { namespace }) private monthlyNetWorth: WorthDate[];

  get chartData(): Record<string, any> {
    const data = {
      labels: this.monthlyNetWorth.map(({ date }) => this.formatDate(date)),
      datasets: [
        {
          label: 'Net Worth',
          data: this.monthlyNetWorth.map(({ worth }) => worth),
          fill: false,
          pointRadius: 10,
          pointHoverRadius: 15,
        },
      ],
    };

    return data;
  }

  private selectedMonth = '';
  private selectedWorth = '';

  private hoverMonth(worthDate: WorthDate) {
    this.selectedMonth = this.formatDate(worthDate.date);
    this.selectedWorth = this.formatCurrency(worthDate.worth);
  }

  mounted() {
    this.selectedMonth = this.formatDate(
      this.monthlyNetWorth[this.monthlyNetWorth.length - 1].date,
    );
    this.selectedWorth = this.formatCurrency(
      this.monthlyNetWorth[this.monthlyNetWorth.length - 1].worth,
    );
  }

  private formatDate(date: string) {
    return moment(date).format('YYYY-MM');
  }

  private formatCurrency(cur: number) {
    const formatter = new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    });

    const result = formatter.format(cur);

    return result.substring(0, result.length - 3);
  }
}
</script>

<style scoped></style>
