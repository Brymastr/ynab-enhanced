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
import { WorthDate } from '@/composables/types';
import BarGraph from '@/components/Graphs/BarGraph.vue';
import { formatCurrency, formatDate } from '../../services/helper';
import { ChartData, ChartOptions, ChartDataset, Tick } from 'chart.js';
import { BLUE, GREY } from '../../colors';
import { defineComponent, PropType } from 'vue';
import { getMonth } from 'date-fns';

interface Props {
  netWorth: WorthDate[];
  changeGraph: boolean;
}

export default defineComponent({
  name: 'Monthly Average Graph',
  components: { BarGraph },
  props: {
    netWorth: {
      type: Object as PropType<WorthDate[]>,
      required: true,
    },
    changeGraph: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: Props) {
    function tickCallback(tickValue: string | number, index: number, ticks: Tick[]) {
      return formatCurrency(tickValue, false);
    }

    function graphData(): ChartData {
      const labels = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

      const months: number[][] = Array.from(Array(12), () => []);
      for (const [index, { date, worth }] of props.netWorth.entries()) {
        const month = getMonth(new Date(date));
        const diff = index > 0 ? worth - props.netWorth[index - 1].worth : 0;
        months[month].push(diff);
      }

      const data = months.map(month => Math.round(month.reduce((acc, cur) => (acc + cur) / 12)));

      const datasets: ChartDataset[] = [
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

    function graphOptions(): ChartOptions {
      const options: ChartOptions = {
        layout: {
          padding: {
            right: 10,
            left: 10,
          },
        },

        responsive: true,
        maintainAspectRatio: false,

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
          y: {
            beginAtZero: false,
            ticks: {
              callback: tickCallback,
              mirror: true,
              labelOffset: -10,
              padding: -4,
            },
            gridLines: {
              drawBorder: true,
            },
          },
          x: {
            ticks: {
              display: true,
              padding: 4,
            },
            gridLines: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
          },
          // crosshair: false,
        },
      };

      return options;
    }

    return { graphData, graphOptions };
  },
});
</script>

<style lang="scss" scoped>
.bar-graph {
  clip-path: inset(8px 0);
}
</style>
