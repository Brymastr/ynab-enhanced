<template>
  <LineGraph
    chart-id="monthly-net-worth-graph"
    class="line-graph cursor-pointer"
    :data="netWorthGraphData"
    :options="netWorthGraphOptions"
  />
</template>

<script lang="ts">
import { WorthDate } from '@/composables/types';
import LineGraph from '@/components/Graphs/LineGraph.vue';
import { formatCurrency, formatDate } from '../../services/helper';
import { ChartData, ChartOptions, ChartDataset, ChartEvent, ActiveElement } from 'chart.js';
import { BLUE } from '../../colors';
import { defineComponent } from '@vue/runtime-core';
import { computed, PropType, ref } from 'vue';

interface Props {
  netWorth: WorthDate[];
  forecast: WorthDate[];
  combined: WorthDate[];
  changeGraph: boolean;
}

export default defineComponent({
  name: 'Net Worth Graph',
  components: { LineGraph },
  props: {
    netWorth: {
      type: Object as PropType<WorthDate[]>,
      required: true,
    },
    forecast: {
      type: Object as PropType<WorthDate[]>,
      required: true,
    },
    combined: {
      type: Object as PropType<WorthDate[]>,
      required: true,
    },
    changeGraph: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: Props, { emit }) {
    const selectedDate = ref<WorthDate>(props.netWorth[props.netWorth.length - 1]);
    const selectedDateIndex = ref<number>(props.netWorth.length - 1);

    function tickCallback(tickValue: string | number) {
      return formatCurrency(tickValue, false);
    }

    function dateHighlighted(highlighted: WorthDate, index: number) {
      highlighted.index = index;
      selectedDate.value = highlighted;
      emit('dateHighlighted', highlighted);
    }

    function onHover(event: ChartEvent, elements: ActiveElement[]) {
      if (elements.length === 0) return;

      const index = elements[0].index;
      if (index === selectedDateIndex.value) return;

      selectedDateIndex.value = index;

      const selected = Object.assign({}, props.netWorth[index]);
      if (index > 0) selected.previous = Object.assign({}, props.netWorth[index - 1]);

      selectedDate.value = selected;

      dateHighlighted(selectedDate.value, selectedDateIndex.value);
    }

    const netWorthGraphData = computed(() => {
      const labels = props.netWorth.map(({ date }) => formatDate(date));

      let actual = props.netWorth.map(({ worth }) => worth);

      const datasets: ChartDataset[] = [
        {
          label: 'Monthly Net Worth',
          data: actual,
          fill: 'origin',
          backgroundColor: 'rgb(98, 179, 237, 0.5)',
          pointBackgroundColor: 'rgb(98, 179, 237)',
          pointRadius: 2.5,
          pointHoverRadius: 5,
          pointBorderWidth: 0,
          tension: 0.3,
        },
      ];

      // if time range includes forecast
      if (props.forecast.length > 0) {
        actual = props.netWorth.concat([props.forecast[0]]).map(({ worth }) => worth);

        const forecast = props.netWorth
          .map(({ date }) => ({ date, worth: NaN }))
          .concat(props.forecast)
          .map(({ worth }) => worth);

        const forecastDataset: ChartDataset = {
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

      const chartData: ChartData = { labels, datasets };

      return chartData;
    });

    const netWorthGraphOptions = computed(() => {
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
        onHover,
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
            grid: {
              drawBorder: false,
            },
          },
          x: {
            ticks: {
              display: false,
            },
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          tooltip: {
            enabled: false,
          },
          legend: {
            display: false,
          },
        },
      };

      return options;
    });

    return { netWorthGraphData, netWorthGraphOptions, dateHighlighted };
  },
});
</script>

<style lang="scss" scoped>
.line-graph {
  clip-path: inset(8px 0);
}
</style>
