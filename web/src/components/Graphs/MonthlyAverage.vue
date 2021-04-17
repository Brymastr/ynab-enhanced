<template>
  <div>
    <BarGraph
      chart-id="monthly-average-diff-graph"
      css-classes="monthly-average-diff-graph"
      class="bar-graph"
      :data="graphData"
      :options="graphOptions"
    />
  </div>
</template>

<script lang="ts">
import { WorthDate } from '@/composables/types';
import BarGraph from '@/components/Graphs/BarGraph.vue';
import { formatCurrency } from '../../services/helper';
import { BLUE } from '../../colors';
import { computed, defineComponent, PropType } from 'vue';
import { getMonth } from 'date-fns';
import { ChartData, ChartDataset, ChartOptions, Tick } from 'chart.js';

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

    const graphData = computed(() => {
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
          backgroundColor: 'rgb(98, 179, 237, 0.5)',
          pointBackgroundColor: 'rgb(98, 179, 237)',
        },
      ];

      const chartData: ChartData = {
        labels,
        datasets,
      };

      return chartData;
    });

    const graphOptions = computed(() => {
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
              display: true,
              mirror: true,
              callback: tickCallback,
              labelOffset: -10,
              padding: -4,
            },
            grid: {
              drawBorder: true,
            },
          },
          x: {
            ticks: {
              display: true,
              padding: 4,
            },
            grid: {
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
    });

    return { graphData, graphOptions };
  },
});
</script>

<style lang="scss" scoped>
.bar-graph {
  clip-path: inset(8px 0);
}
</style>
