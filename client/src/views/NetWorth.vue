<template>
  <div class="container">
    <div class="loading" v-if="!monthlyNetWorth">Loading...</div>
    <div class="graphs" v-else>
      <DateSelect :dates="dateList" />
      <CurrentNetWorthSummary
        :date="highlightedMonth"
        :worth="highlightedWorth"
        :difference="highlightedDifference"
      />
      <NetWorthGraph
        chart-id="monthly-net-worth-graph"
        css-classes="monthly-net-worth-graph"
        :chartData="monthlyNetWorthGraphData"
        :monthlyNetWorth="monthlyNetWorth"
        :tickCharacters="longestTick"
        v-on:monthSelected="dateHighlighted"
      />
      <NetChangeGraph
        chart-id="monthly-change-graph"
        css-classes="monthly-change-graph"
        :chartData="monthlyChangeGraphData"
        :tickCharacters="longestTick"
      />
    </div>
    <div class="stats">
      <NetChange :monthlyNetWorth="monthlyNetWorth" />
      <AverageChange :monthlyNetWorth="monthlyNetWorth" />
      <PositiveNegative :monthlyNetWorth="monthlyNetWorth" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import Nav from '@/components/Nav.vue';
import CurrentNetWorthSummary from '@/components/CurrentNetWorthSummary.vue';
import NetWorthGraph from '@/components/NetWorthGraph.vue';
import NetChangeGraph from '@/components/NetChangeGraph.vue';
import NetChange from '@/components/NetChange.vue';
import AverageChange from '@/components/AverageChange.vue';
import PositiveNegative from '@/components/PositiveNegative.vue';
import DateSelect from '@/components/DateSelect.vue';
import { WorthDate } from '../store/modules/ynab/types';
import moment from 'moment';
import 'chartjs-plugin-crosshair';
import { ChartData } from 'chart.js';
const namespace = 'ynab';

@Component({
  components: {
    Nav,
    CurrentNetWorthSummary,
    NetWorthGraph,
    NetChangeGraph,
    DateSelect,
    NetChange,
    AverageChange,
    PositiveNegative,
  },
})
export default class NetWorth extends Vue {
  @State('selectedBudgetId', { namespace })
  private budgetId!: string;

  @Getter('getMonthlyNetWorth', { namespace })
  private getMonthlyNetWorth!: Function;

  @Getter('getSelectedStartDate', { namespace })
  private getSelectedStartDate!: Function;

  private get getSelectedStartDateComputed() {
    return this.getSelectedStartDate();
  }

  @Getter('getSelectedEndDate', { namespace })
  private getSelectedEndDate!: Function;

  private get getSelectedEndDateComputed() {
    return this.getSelectedEndDate();
  }

  @Action('loadNetWorth', { namespace })
  private loadNetWorth!: Function;

  private monthlyNetWorth: WorthDate[] | null = null;

  private highlightedMonth: string | null = null;
  private highlightedWorth: string | null = null;
  private highlightedDifference = '-';
  private ready = false;

  @Watch('budgetId')
  @Watch('getSelectedStartDateComputed')
  @Watch('getSelectedEndDateComputed')
  private async rebuild() {
    let monthlyNetWorth: WorthDate[];
    monthlyNetWorth = this.getMonthlyNetWorth(this.budgetId);

    if (!monthlyNetWorth || monthlyNetWorth.length === 0) {
      await this.loadNetWorth();
      monthlyNetWorth = this.getMonthlyNetWorth(this.budgetId);
    }

    const start = this.getSelectedStartDate(this.budgetId);
    const end = this.getSelectedEndDate(this.budgetId);

    const filtered = this.filterDateRange(start, end, monthlyNetWorth);

    this.monthlyNetWorth = filtered;
  }

  private filterDateRange(start: string, end: string, all: WorthDate[]) {
    return all.filter(({ date }) => {
      const current = moment(date);
      return current.isBetween(moment(start), moment(end), undefined, '[]');
    });
  }

  private get monthlyNetWorthGraphData(): ChartData | null {
    if (this.monthlyNetWorth === null) return null;
    const labels = this.monthlyNetWorth.map(({ date }) => this.formatDate(date));
    const data = this.monthlyNetWorth.map(({ worth }) => worth);

    const obj: ChartData = {
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

  private get monthlyChangeGraphData(): ChartData | null {
    if (this.monthlyNetWorth === null) return null;
    const labels = this.monthlyNetWorth.map(({ date }) => this.formatDate(date));
    const data = this.monthlyNetWorth.map(({ worth }, index, all) => {
      if (index === 0) return 0;
      return worth - all[index - 1].worth;
    });

    const obj: ChartData = {
      labels,
      datasets: [
        {
          label: 'Monthly Change',
          data,
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 3,
        },
      ],
    };

    return obj;
  }

  private get longestTick() {
    if (this.monthlyNetWorth === null) return null;
    const nums = this.monthlyNetWorth.map(({ worth }) => Math.abs(worth));
    const largestNum = Math.max(...nums);
    const largestTickLabelLength = this.formatCurrency(largestNum).length + 1;
    return largestTickLabelLength;
  }

  protected get dateList() {
    const monthlyNetWorth: WorthDate[] = this.getMonthlyNetWorth(this.budgetId);
    return monthlyNetWorth.map(({ date }) => date);
  }

  private dateHighlighted(highlighted: WorthDate) {
    this.highlightedMonth = this.formatDate(highlighted.date);
    this.highlightedWorth = this.formatCurrency(highlighted.worth);
    if (highlighted.previous) {
      const diff = highlighted.worth - highlighted.previous.worth;
      const diffStr = this.formatCurrency(diff);
      this.highlightedDifference = `${diff > 0 ? '+' : ''}${diffStr}`;
    } else {
      this.highlightedDifference = '-';
    }
  }

  private async mounted() {
    await this.rebuild();
    if (this.monthlyNetWorth === null) return;
    this.dateHighlighted(this.monthlyNetWorth[this.monthlyNetWorth.length - 1]);
    this.ready = true;
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

<style scoped lang="scss">
.container {
  > div {
    margin: 10px 10px 0 10px;
  }
}

.graphs {
  display: grid;
  height: 75vh;
  min-height: 400px;
  grid-template-columns: min-content 1fr min-content;
  grid-template-areas:
    'date-select . summary'
    'net-worth-graph net-worth-graph net-worth-graph'
    'net-change-graph net-change-graph net-change-graph';
}

.stats {
  display: flex;

  > div {
    flex-grow: 1;
  }
}
</style>
