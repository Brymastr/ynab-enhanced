<template>
  <div>
    <div class="loading" v-if="!ready">Loading...</div>
    <div class="net-worth" v-else>
      <div class="main-graph">
        <DateSelect :dates="dateList" v-on:dateRangeSelected="dateRangeSelected" />
        <CurrentNetWorthSummary
          :date="highlightedMonth"
          :worth="highlightedWorth"
          :difference="isFirstMonth(highlightedMonth) ? null : highlightedDifference"
        />
        <MonthlyNetWorthGraph
          chart-id="monthly-net-worth-graph"
          v-if="monthlyNetWorth"
          :chartData="monthlyNetWorthGraphData"
          :monthlyNetWorth="getDatesInRange"
          v-on:monthSelected="dateHighlighted"
          css-classes="monthly-net-worth-graph"
          :selectedStartDate="selectedStartDate"
          :selectedEndDate="selectedEndDate"
        />
        <MonthlyChangeGraph
          chart-id="monthly-change-graph"
          v-if="monthlyNetWorth"
          :chartData="monthlyChangeGraphData"
          :monthlyNetWorth="getDatesInRange"
          v-on:monthSelected="dateHighlighted"
          css-classes="monthly-change-graph"
          :selectedStartDate="selectedStartDate"
          :selectedEndDate="selectedEndDate"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import Nav from '@/components/Nav.vue';
import CurrentNetWorthSummary from '@/components/CurrentNetWorthSummary.vue';
import MonthlyNetWorthGraph from '@/components/MonthlyNetWorthGraph.vue';
import MonthlyChangeGraph from '@/components/MonthlyChangeGraph.vue';
import DateSelect from '@/components/DateSelect.vue';
import { WorthDate, DateRange } from '../store/modules/ynab/types';
import moment from 'moment';
import 'chartjs-plugin-crosshair';
import { ChartData } from 'chart.js';
const namespace = 'ynab';

@Component({
  components: {
    Nav,
    CurrentNetWorthSummary,
    MonthlyNetWorthGraph,
    MonthlyChangeGraph,
    DateSelect,
  },
})
export default class NetWorth extends Vue {
  @State('selectedBudgetId', { namespace }) private budgetId!: string;
  @Getter('getMonthlyNetWorth', { namespace }) private getMonthlyNetWorth!: Function;
  @Action('loadMonthlyNetWorth', { namespace }) private loadMonthlyNetWorth!: Function;

  private monthlyNetWorth!: WorthDate[];

  private selectedStartDate: string | null = null;
  private selectedEndDate: string | null = null;
  private highlightedMonth!: string;
  private highlightedWorth!: string;
  private highlightedDifference = '-';
  private firstMonth!: string;

  private ready = false;

  private get getDatesInRange() {
    return this.monthlyNetWorth.filter(({ date }) => {
      if (!this.selectedStartDate || !this.selectedEndDate)
        this.dateRangeSelected({
          start: this.monthlyNetWorth[0].date,
          end: this.monthlyNetWorth[this.monthlyNetWorth.length - 1].date,
        });
      const current = moment(date);
      const start = moment(this.selectedStartDate);
      const end = moment(this.selectedEndDate);
      return current.isBetween(start, end, undefined, '[]');
    });
  }

  private get monthlyNetWorthGraphData(): ChartData {
    const labels = this.getDatesInRange.map(({ date }) => this.formatDate(date));
    const data = this.getDatesInRange.map(({ worth }) => worth);

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

  private get monthlyChangeGraphData(): ChartData {
    const labels = this.getDatesInRange.map(({ date }) => this.formatDate(date));
    const data = this.getDatesInRange.map(({ worth }, index, all) => {
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
          pointRadius: 0,
          pointHoverRadius: 3,
        },
      ],
    };

    return obj;
  }

  protected get dateList() {
    return this.monthlyNetWorth.map(({ date }) => date);
  }

  private dateHighlighted(highlighted: WorthDate) {
    this.highlightedMonth = this.formatDate(highlighted.date);
    this.highlightedWorth = this.formatCurrency(highlighted.worth);
    if (highlighted.previous) {
      const diff = highlighted.worth - highlighted.previous.worth;
      const diffStr = this.formatCurrency(diff);
      this.highlightedDifference = `${diff > 0 ? '+' : ''}${diffStr}`;
    }
  }

  private dateRangeSelected(dateRange: DateRange) {
    const { start, end } = dateRange;
    this.selectedStartDate = start;
    this.selectedEndDate = end;
  }

  private isFirstMonth(highlightedMonth: string) {
    return highlightedMonth === this.firstMonth;
  }

  private async updateItems() {
    const monthlyNetWorth = this.getMonthlyNetWorth(this.budgetId);

    if (!monthlyNetWorth || monthlyNetWorth.length === 0) await this.loadMonthlyNetWorth();
    this.monthlyNetWorth = this.getMonthlyNetWorth(this.budgetId);
  }

  private async mounted() {
    await this.updateItems();

    this.firstMonth = this.formatDate(this.monthlyNetWorth[0].date);

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

<style scoped>
.net-worth {
  margin: 10px;
  height: 100%;
}

.main-graph {
  position: relative;
  display: grid;
  height: 75vh;
  min-height: 400px;
  grid-template-columns: min-content 1fr min-content;
  grid-template-areas:
    'date-select . summary'
    'net-worth net-worth net-worth'
    'net-change net-change net-change';
}

.monthly-net-worth-graph {
  grid-area: net-worth;
  margin-bottom: -20px;
  min-height: 250px;
  min-width: 0;
}

.monthly-change-graph {
  grid-area: net-change;
  min-height: 50px;
  min-width: 0;
}
</style>
