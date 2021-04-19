<template>
  <div class="flex flex-col text-xl gap-y-3 pb-3 bg-gray-200 shadow-lg rounded-sm min-h-300">
    <div class="flex-grow-0 text-gray-200 bg-gray-800 p-2 rounded-t-sm">
      Average Change by Month
    </div>
    <div class="flex-grow w-full">
      <BarGraph
        chart-id="monthly-average-diff-graph"
        class="bar-graph cursor-pointer"
        :data="data"
        :options="options"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { WorthDate } from '@/composables/types';
import BarGraph from '@/components/Graphs/BarGraph.vue';
import { formatCurrency } from '../../services/helper';
import { BLUE } from '../../colors';
import { computed, defineComponent, PropType } from 'vue';
import { getMonth } from 'date-fns';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';

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
    function tickCallback(tickValue: string | number) {
      return formatCurrency(tickValue, false);
    }

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

    const diffByMonth = computed(() => {
      const months: number[][] = Array.from(Array(12), () => []);
      for (const [, { date, worth, previous }] of props.netWorth.entries()) {
        const month = getMonth(new Date(date));
        const diff = worth - (previous?.worth ?? 0);
        months[month].push(diff);
      }

      // `months` is a 2d array with each higher order array referencing a month
      return months.map(month => Math.round(month.reduce((acc, cur) => (acc + cur) / 12, 0)));
    });

    const graphData = computed(() => {
      const data = diffByMonth.value;

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

    return { data: graphData, options: graphOptions };
  },
});
</script>

<style lang="scss" scoped>
.bar-graph {
  clip-path: inset(8px 0);
}
</style>
