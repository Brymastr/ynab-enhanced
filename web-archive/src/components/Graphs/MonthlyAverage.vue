<template>
  <div>
    <BarGraph
      chart-id="monthly-average-diff-graph"
      css-classes="monthly-average-diff-graph"
      class="bar-graph"
      :chartData="graphData"
      :options="graphOptions"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { WorthDate } from '../../store/modules/ynab/types';
import BarGraph from '@/components/Graphs/BarGraph.vue';
import { formatCurrency, formatDate } from '../../services/helper';
import { ChartData, ChartOptions, ChartDataSets } from 'chart.js';
import { BLUE, GREY } from '../../colors';
import moment from 'moment';

@Component({
  components: { BarGraph },
})
export default class NetWorth extends Vue {
  @Prop({ required: true }) netWorth!: WorthDate[];
  @Prop({ required: false, default: false }) changeGraph!: boolean;

  private get graphData(): ChartData | null {
    if (this.netWorth === null) return null;
    const labels = moment.monthsShort();

    const months: number[][] = Array.from(Array(12), () => []);
    for (const [index, { date, worth }] of this.netWorth.entries()) {
      const month = moment(date).month();
      const diff = index > 0 ? worth - this.netWorth[index - 1].worth : 0;
      months[month].push(diff);
    }

    const data = months.map(month => Math.round(month.reduce((acc, cur) => (acc + cur) / 12)));

    const datasets: ChartDataSets[] = [
      {
        label: 'Average Gain by Month',
        data,
        fill: 'zero',
        backgroundColor: 'rgb(98, 179, 237, 0.5)',
        pointBackgroundColor: 'rgb(98, 179, 237)',
      },
    ];

    const chartData: ChartData = {
      labels,
      datasets,
    };

    return chartData;
  }

  private get graphOptions(): ChartOptions | null {
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
        enabled: true,
      },
      events: ['mousemove', 'click'],
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
              z: 1,
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              display: true,
              padding: 4,
            },
            gridLines: {
              display: false,
              tickMarkLength: 0,
            },
          },
        ],
      },
      plugins: {
        crosshair: false,
      },
    };

    return options;
  }

  private formatTickLabels(cur: number) {
    return formatCurrency(cur);
  }
}
</script>

<style lang="scss" scoped>
.bar-graph {
  clip-path: inset(8px 0);
}
</style>
