<template>
  <LineGraph
    chart-id="monthly-net-worth-graph"
    class="line-graph"
    :data="netWorthGraphData"
    :options="netWorthGraphOptions"
    v-on:dateHighlighted="dateHighlighted"
  />
  <!-- <LineGraph
      v-if="monthlyChange"
      chart-id="monthly-change-graph"
      css-classes="monthly-change-graph"
      :chartData="monthlyChangeGraphData"
      :options="monthlyChangeGraphOptions"
      :plugins="plugins"
    /> -->
</template>

<script lang="ts">
import { WorthDate } from '@/composables/types';
import LineGraph from '@/components/Graphs/LineGraph.vue';
import { formatCurrency, formatDate } from '../../services/helper';
// import ChartBand from '../../ChartBands';
// import 'chartjs-plugin-crosshair';
import {
  ChartData,
  ChartOptions,
  ChartDataset,
  Tick,
  ChartEvent,
  ActiveElement,
  Chart,
  ChartTypeRegistry,
  ScatterDataPoint,
  BubbleDataPoint,
} from 'chart.js';
import { BLUE, GREY } from '../../colors';
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
    const selectedDateIndex = ref<number>(0);

    const lastDate = computed(() => props.combined[props.combined.length - 1]);
    const previousDate = computed(() => props.combined[props.combined.length - 2]);
    lastDate.value.previous = previousDate.value;

    function tickCallback(tickValue: string | number, index: number, ticks: Tick[]) {
      return formatCurrency(tickValue, false);
    }

    function dateHighlighted(highlighted: WorthDate, index: number) {
      highlighted.index = index;
      selectedDate.value = highlighted;
      emit('dateHighlighted', highlighted);
    }

    function onHover(
      event: ChartEvent,
      elements: ActiveElement[],
      chart: Chart<
        keyof ChartTypeRegistry,
        number[] | ScatterDataPoint[] | BubbleDataPoint[],
        unknown
      >,
    ) {
      if (elements.length === 0) return;

      const index = elements[0].index;
      if (index === selectedDateIndex.value) return;

      selectedDateIndex.value = index;

      const selected = props.combined[index];
      if (index > 0) selected.previous = props.combined[index - 1];

      selectedDate.value = selected;

      dateHighlighted(selectedDate.value, selectedDateIndex.value);
    }

    const netWorthGraphData = computed(() => {
      const labels = props.combined.map(({ date }) => formatDate(date));

      let actual = props.netWorth.map(({ worth }) => worth);

      const datasets: ChartDataset[] = [
        {
          label: 'Monthly Net Worth',
          data: actual,
          // fill: 'zero',
          backgroundColor: 'rgb(98, 179, 237, 0.5)',
          pointBackgroundColor: 'rgb(98, 179, 237)',
          pointRadius: 2,
          pointHoverRadius: 5,
          // pointBorderWidth: 0,
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
            gridLines: {
              drawBorder: true,
            },
          },
          x: {
            ticks: {
              display: false,
            },
            gridLines: {
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
          // crosshair: {
          //   line: {
          //     color: GREY,
          //     width: 0.5,
          //   },
          //   zoom: { enabled: false },
          //   snap: { enabled: true },
          //   sync: { enabled: true },
          // },
        },
      };

      return options;
    });

    const monthlyChangeGraphData = computed(() => {
      const labels = props.combined.map(({ date }) => formatDate(date));
      const data = props.combined.map(({ worth }, index, all) => {
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
    });

    const monthlyChangeGraphOptions = computed(() => {
      const options: ChartOptions = {
        layout: {
          padding: {
            right: 35,
          },
        },

        responsive: true,
        maintainAspectRatio: false,

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
            ticks: {
              callback: tickCallback,
            },
            gridLines: {
              drawBorder: false,
              lineWidth: 0,
            },
          },
          x: {
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
            enabled: false,
          },
          // crosshair: {
          //   line: {
          //     color: GREY,
          //     width: 0.5,
          //   },
          //   zoom: { enabled: false },
          //   snap: { enabled: true },
          //   sync: { enabled: true },
          // },
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
