<template>
  <div class="net-worth">
    <DateSelect :dates="dateList" />
    <CurrentNetWorthSummary v-if="selectedWorthDate" :worthDate="selectedWorthDate" />
    <LineGraph
      chart-id="monthly-net-worth-graph"
      css-classes="monthly-net-worth-graph"
      :chartData="monthlyNetWorthGraphData"
      :options="monthlyNetWorthGraphOptions"
      v-on:monthSelected="dateHighlighted"
    />
    <LineGraph
      chart-id="monthly-change-graph"
      css-classes="monthly-change-graph"
      :chartData="monthlyChangeGraphData"
      :options="monthlyChangeGraphOptions"
      :plugins="plugins"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { WorthDate } from '../../store/modules/ynab/types';
import LineGraph from '@/components/Graphs/LineGraph.vue';
import DateSelect from '@/components/Graphs/DateSelect.vue';
import CurrentNetWorthSummary from '@/components/Graphs/CurrentNetWorthSummary.vue';
import { formatCurrency, formatDate } from '../../services/helper';
import moment from 'moment';
import ChartBand from '../../ChartBands';
import 'chartjs-plugin-crosshair';
import { ChartData, ChartOptions } from 'chart.js';
import { BLUE, GREY } from '../../colors';

@Component({
  components: {
    CurrentNetWorthSummary,
    LineGraph,
    DateSelect,
  },
})
export default class NetWorth extends Vue {
  @Prop({ required: true }) protected monthlyNetWorth!: WorthDate[];
  @Prop({ required: true }) protected dateList!: string[];

  private plugins = [ChartBand];

  private selectedWorthDate: WorthDate | null = null;

  private selectedDateIndex = 0;

  created() {
    this.selectedWorthDate = this.monthlyNetWorth[this.monthlyNetWorth.length - 1];
  }

  private get monthlyNetWorthGraphData(): ChartData | null {
    if (this.monthlyNetWorth === null) return null;
    const labels = this.monthlyNetWorth.map(({ date }) => formatDate(date));
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
    const labels = this.monthlyNetWorth.map(({ date }) => formatDate(date));
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

  private get monthlyNetWorthGraphOptions(): ChartOptions | null {
    const options: ChartOptions = {
      layout: {
        padding: {
          right: 35,
        },
      },
      legend: {
        display: false,
      },
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: false,
      },
      events: ['mousemove', 'click'],
      hover: {
        mode: 'index',
        intersect: false,
      },
      onHover: this.onHover,
      elements: {
        point: {
          pointStyle: 'circle',
          borderWidth: 0,
          backgroundColor: BLUE,
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: false,
              callback: formatCurrency,
              fontFamily: 'monospace',
            },
            gridLines: {
              drawBorder: false,
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              display: false,
            },
            gridLines: {
              display: false,
            },
          },
        ],
      },
      plugins: {
        crosshair: {
          line: {
            color: GREY,
            width: 0.5,
          },
          zoom: { enabled: false },
          snap: { enabled: true },
          sync: { enabled: true },
        },
      },
    };

    return options;
  }

  private get monthlyChangeGraphOptions(): ChartOptions | null {
    const options: ChartOptions = {
      layout: {
        padding: {
          right: 35,
        },
      },
      legend: {
        display: false,
      },
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: false,
      },
      hover: {
        mode: 'index',
        intersect: false,
      },
      elements: {
        point: {
          pointStyle: 'circle',
          borderWidth: 0,
          backgroundColor: BLUE,
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              callback: this.formatTickLabels,
              fontFamily: 'monospace',
            },
            gridLines: {
              drawBorder: false,
              lineWidth: 0,
              zeroLineWidth: 1,
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
      },
      plugins: {
        crosshair: {
          line: {
            color: GREY,
            width: 0.5,
          },
          zoom: { enabled: false },
          snap: { enabled: true },
          sync: { enabled: true },
        },
      },
    };

    return options;
  }

  private get longestTick() {
    if (this.monthlyNetWorth === null) return null;
    const nums = this.monthlyNetWorth.map(({ worth }) => Math.abs(worth));
    const largestNum = Math.max(...nums);
    const largestTickLabelLength = formatCurrency(largestNum).length + 1;
    return largestTickLabelLength;
  }

  private onHover(event: MouseEvent, activeElements: Array<{ _index: number }>) {
    if (activeElements.length === 0) return;

    const index = activeElements[0]._index;
    if (index === this.selectedDateIndex) return;

    this.selectedDateIndex = index;

    const selected = this.monthlyNetWorth[index];
    if (index > 0) selected.previous = this.monthlyNetWorth[index - 1];

    this.selectedWorthDate = selected;
  }

  private formatTickLabels(cur: number) {
    const formatter = new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    });

    let result = '';

    if (cur === 0) result = formatter.format(cur);

    return result.substring(0, result.length - 3).padStart(this.longestTick, ' ');
  }

  private dateHighlighted(highlighted: WorthDate) {
    this.selectedWorthDate = highlighted;
  }
}
</script>

<style lang="scss" scoped>
.net-worth {
  display: grid;
  grid-template-columns: min-content 1fr min-content;
  grid-template-rows: min-content auto auto;
  grid-template-areas:
    'date-select . summary'
    'net-worth-graph net-worth-graph net-worth-graph'
    'net-change-graph net-change-graph net-change-graph';
}

.monthly-net-worth-graph {
  grid-area: net-worth-graph;
  margin-bottom: -20px;
  min-height: 250px;
  min-width: 0;
}

.monthly-change-graph {
  grid-area: net-change-graph;
  min-height: 50px;
  min-width: 0;
}
</style>
