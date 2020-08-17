<template>
  <div class="net-worth">
    <DateSelect :dates="dateList" />
    <CurrentNetWorthSummary :worthDate="selectedDate" />
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
import ChartBand from '../../ChartBands';
import 'chartjs-plugin-crosshair';
import { ChartData, ChartOptions, ChartDataSets } from 'chart.js';
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
  @Prop({ required: false, default: [] }) protected monthlyForecast!: WorthDate[];
  @Prop({ required: true }) protected dateList!: string[];

  private get combined(): WorthDate[] {
    return [...this.monthlyNetWorth, ...this.monthlyForecast];
  }

  private plugins = [ChartBand];

  private selectedDate: WorthDate | null = null;

  private selectedDateIndex = 0;

  created() {
    this.selectedDate = this.monthlyNetWorth[this.monthlyNetWorth.length - 1];
  }

  private get monthlyNetWorthGraphData(): ChartData | null {
    if (this.monthlyNetWorth === null) return null;
    const labels = this.combined.map(({ date }) => formatDate(date));

    let actual: number[];
    if (this.monthlyForecast.length > 0)
      actual = this.monthlyNetWorth.concat([this.monthlyForecast[0]]).map(({ worth }) => worth);
    else actual = this.monthlyNetWorth.map(({ worth }) => worth);

    const datasets: ChartDataSets[] = [
      {
        label: 'Monthly Net Worth',
        data: actual,
        fill: false,
        pointRadius: 5,
        pointHoverRadius: 10,
      },
    ];

    if (this.monthlyForecast.length > 0) {
      const forecast = this.monthlyNetWorth
        .map(({ date }) => ({ date, worth: NaN }))
        .concat(this.monthlyForecast)
        .map(({ worth }) => worth);

      datasets.push({
        label: 'Forecast',
        data: forecast,
        fill: true,
        spanGaps: false,
        pointRadius: 5,
        pointHoverRadius: 10,
      });
    }

    const chartData: ChartData = {
      labels,
      datasets,
    };

    return chartData;
  }

  private get monthlyChangeGraphData(): ChartData | null {
    const labels = this.combined.map(({ date }) => formatDate(date));
    const data = this.combined.map(({ worth }, index, all) => {
      if (index === 0) return 0;
      return worth - all[index - 1].worth;
    });

    const chartData: ChartData = {
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

    return chartData;
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
    const nums = this.combined.map(({ worth }) => worth);
    const largest = Math.max(...nums);
    const smallest = Math.min(...nums);

    const largestTickLabelLength = Math.max(
      formatCurrency(largest).length,
      formatCurrency(smallest).length,
    );
    return largestTickLabelLength;
  }

  private onHover(event: MouseEvent, activeElements: Array<{ _index: number }>) {
    if (activeElements.length === 0) return;

    const index = activeElements[0]._index;
    if (index === this.selectedDateIndex) return;

    this.selectedDateIndex = index;

    const selected = this.combined[index];
    if (index > 0) selected.previous = this.combined[index - 1];

    this.selectedDate = selected;
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
    this.selectedDate = highlighted;
  }

  mounted() {
    const lastDate = this.combined[this.combined.length - 1];
    const previousDate = this.combined[this.combined.length - 2];
    lastDate.previous = previousDate;
    this.selectedDate = lastDate;
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
