<template>
  <div class="net-worth">
    <LineGraph
      chart-id="monthly-net-worth-graph"
      css-classes="monthly-net-worth-graph"
      class="line-graph"
      :chartData="monthlyNetWorthGraphData"
      :options="monthlyNetWorthGraphOptions"
      v-on:dateHighlighted="dateHighlighted"
    />
    <LineGraph
      v-if="monthlyChange"
      chart-id="monthly-change-graph"
      css-classes="monthly-change-graph"
      :chartData="monthlyChangeGraphData"
      :options="monthlyChangeGraphOptions"
      :plugins="plugins"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { WorthDate } from '../../store/modules/ynab/types';
import LineGraph from '@/components/Graphs/LineGraph.vue';
import { formatCurrency, formatDate } from '../../services/helper';
import ChartBand from '../../ChartBands';
import 'chartjs-plugin-crosshair';
import { ChartData, ChartOptions, ChartDataSets } from 'chart.js';
import { BLUE, GREY } from '../../colors';

@Component({
  components: { LineGraph },
})
export default class NetWorth extends Vue {
  @Prop({ required: true }) protected monthlyNetWorth!: WorthDate[];
  @Prop({ required: false, default: [] }) protected monthlyForecast!: WorthDate[];
  @Prop({ required: true }) protected dateList!: string[];
  @Prop({ required: false, default: false }) protected monthlyChange!: boolean;

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
    if (this.monthlyForecast.length > 0) {
      actual = this.monthlyNetWorth.concat([this.monthlyForecast[0]]).map(({ worth }) => worth);
    } else {
      actual = this.monthlyNetWorth.map(({ worth }) => worth);
    }

    const datasets: ChartDataSets[] = [
      {
        label: 'Monthly Net Worth',
        data: actual,
        fill: 'zero',
        backgroundColor: 'rgb(98, 179, 237, 0.5)',
        pointBackgroundColor: 'rgb(98, 179, 237)',
        pointRadius: 2,
        pointHoverRadius: 5,
        pointBorderWidth: 0,
      },
    ];

    if (this.monthlyForecast.length > 0) {
      const forecast = this.monthlyNetWorth
        .map(({ date }) => ({ date, worth: NaN }))
        .concat(this.monthlyForecast)
        .map(({ worth }) => worth);

      const forecastDataset: ChartDataSets = {
        label: 'Forecast',
        data: forecast,
        fill: 'zero',
        spanGaps: false,
        pointBackgroundColor: '#2D3848',
        pointRadius: 2,
        pointHoverRadius: 5,
        pointBorderWidth: 0,
      };

      datasets.push(forecastDataset);
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
          right: 10,
          left: 10,
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
              callback: this.formatTickLabels,
              fontFamily: 'system-ui',
              mirror: true,
              labelOffset: -10,
              padding: -4,
            },
            gridLines: {
              drawBorder: true,
              tickMarkLength: 0,
              z: 2,
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
              tickMarkLength: 0,
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

    // @ts-ignore
    event.target.style.cursor = activeElements[0] ? 'pointer' : 'default';

    const index = activeElements[0]._index;
    if (index === this.selectedDateIndex) return;

    this.selectedDateIndex = index;

    const selected = this.combined[index];
    if (index > 0) selected.previous = this.combined[index - 1];

    this.selectedDate = selected;

    this.dateHighlighted(this.selectedDate, this.selectedDateIndex);
  }

  private formatTickLabels(cur: number) {
    return formatCurrency(cur);
  }

  @Emit('dateHighlighted')
  private dateHighlighted(highlighted: WorthDate, index: number) {
    highlighted.index = index;
    this.selectedDate = highlighted;
    return highlighted;
  }

  mounted() {
    const lastDate = this.combined[this.combined.length - 1];
    const previousDate = this.combined[this.combined.length - 2];
    lastDate.previous = previousDate;
    this.dateHighlighted(lastDate, this.combined.length - 1);
  }
}
</script>

<style lang="scss" scoped>
.line-graph {
  clip-path: inset(8px 0);
}
</style>
