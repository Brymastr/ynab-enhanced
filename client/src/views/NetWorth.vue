<template>
  <div class="net-worth">
    <CurrentNetWorthSummary
      :date="selectedMonth"
      :worth="selectedWorth"
      :difference="isFirstMonth(selectedMonth) ? null : selectedDifference"
    />
    <MonthlyNetWorthGraph
      chart-id="monthly-net-worth-graph"
      v-if="monthlyNetWorthGraphData"
      :chartData="monthlyNetWorthGraphData"
      :monthlyNetWorth="monthlyNetWorth"
      v-on:monthSelected="monthSelected"
      css-classes="monthly-net-worth-graph"
    />
    <MonthlyChangeGraph
      chart-id="monthly-change-graph"
      v-if="monthlyChangeGraphData"
      :chartData="monthlyChangeGraphData"
      :monthlyNetWorth="monthlyNetWorth"
      v-on:monthSelected="monthSelected"
      css-classes="monthly-change-graph"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import CurrentNetWorthSummary from '@/components/CurrentNetWorthSummary.vue';
import MonthlyNetWorthGraph from '@/components/MonthlyNetWorthGraph.vue';
import MonthlyChangeGraph from '@/components/MonthlyChangeGraph.vue';
import { WorthDate } from '../store/modules/netWorth/types';
import moment from 'moment';
import 'chartjs-plugin-crosshair';
const namespace = 'netWorth';

@Component({
  components: {
    CurrentNetWorthSummary,
    MonthlyNetWorthGraph,
    MonthlyChangeGraph,
  },
})
export default class NetWorth extends Vue {
  @State('monthlyNetWorth', { namespace }) private monthlyNetWorth!: WorthDate[];

  get monthlyNetWorthGraphData(): Record<string, any> {
    const labels = this.monthlyNetWorth.map(({ date }) => this.formatDate(date));
    const data = this.monthlyNetWorth.map(({ worth }) => worth);

    const obj = {
      labels,
      datasets: [
        {
          label: 'Monthly Net Worth',
          data,
          fill: false,
          pointRadius: 5,
          pointHoverRadius: 10,
        },
      ],
    };

    return obj;
  }

  get monthlyChangeGraphData(): Record<string, any> {
    const labels = this.monthlyNetWorth.map(({ date }) => this.formatDate(date));
    const data = this.monthlyNetWorth.map(({ worth }, index, all) => {
      if (index === 0) return 0;
      return worth - all[index - 1].worth;
    });

    const obj = {
      labels,
      datasets: [
        {
          label: 'Monthly Change',
          data,
          fill: false,
          pointRadius: 5,
          pointHoverRadius: 10,
        },
      ],
    };

    return obj;
  }

  private selectedMonth = '';
  private selectedWorth = '';
  private selectedDifference = '';
  private firstMonth = '';

  private monthSelected(worthDate: WorthDate) {
    this.selectedMonth = this.formatDate(worthDate.date);
    this.selectedWorth = this.formatCurrency(worthDate.worth);
    if (worthDate.previous) {
      const diff = worthDate.worth - worthDate.previous.worth;
      const diffStr = this.formatCurrency(diff);
      this.selectedDifference = `${diff > 0 ? '+' : ''}${diffStr}`;
    }
  }

  private isFirstMonth(selectedMonth: string) {
    return selectedMonth === this.firstMonth;
  }

  mounted() {
    this.selectedMonth = this.formatDate(
      this.monthlyNetWorth[this.monthlyNetWorth.length - 1].date,
    );
    this.selectedWorth = this.formatCurrency(
      this.monthlyNetWorth[this.monthlyNetWorth.length - 1].worth,
    );
    this.firstMonth = this.formatDate(this.monthlyNetWorth[0].date);
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

<style scoped>
.net-worth {
  display: grid;
  grid-template-rows: min-content auto 25%;
  grid-template-areas:
    '. . summary'
    'net-worth net-worth net-worth'
    'net-change net-change net-change';
  height: 60%;
  margin: 10px;
}

.monthly-net-worth-graph {
  grid-area: net-worth;
  min-width: 0;
  margin-bottom: -20px;
}

.monthly-change-graph {
  grid-area: net-change;
  min-width: 0;
}
</style>
