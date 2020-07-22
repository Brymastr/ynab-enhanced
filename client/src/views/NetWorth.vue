<template>
  <div class="net-worth">
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
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import CurrentNetWorthSummary from '@/components/CurrentNetWorthSummary.vue';
import MonthlyNetWorthGraph from '@/components/MonthlyNetWorthGraph.vue';
import MonthlyChangeGraph from '@/components/MonthlyChangeGraph.vue';
import DateSelect from '@/components/DateSelect.vue';
import { WorthDate, DateRange } from '../store/modules/netWorth/types';
import moment from 'moment';
import 'chartjs-plugin-crosshair';
const namespace = 'netWorth';

@Component({
  components: {
    CurrentNetWorthSummary,
    MonthlyNetWorthGraph,
    MonthlyChangeGraph,
    DateSelect,
  },
})
export default class NetWorth extends Vue {
  @State('monthlyNetWorth', { namespace }) private monthlyNetWorth!: WorthDate[];

  private selectedStartDate: string = null;
  private selectedEndDate: string = null;
  private highlightedMonth: string = null;
  private highlightedWorth: string = null;
  private highlightedDifference: string = null;
  private firstMonth: string = null;

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

  private get monthlyNetWorthGraphData(): Record<string, any> {
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

  private get monthlyChangeGraphData(): Record<string, any> {
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

  private dateHighlighted(worthDate: WorthDate) {
    this.highlightedMonth = this.formatDate(worthDate.date);
    this.highlightedWorth = this.formatCurrency(worthDate.worth);
    if (worthDate.previous) {
      const diff = worthDate.worth - worthDate.previous.worth;
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

  private mounted() {
    this.highlightedMonth = this.formatDate(
      this.monthlyNetWorth[this.monthlyNetWorth.length - 1].date,
    );
    this.highlightedWorth = this.formatCurrency(
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
    'date-select . summary'
    'net-worth net-worth net-worth'
    'net-change net-change net-change';
  height: 50%;
  margin: 10px;
  border-top: 1px solid #e5e5e5;
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
