<template>
  <canvas :id="chartId"></canvas>
</template>

<script lang="ts">
import { Chart, ChartOptions, ChartData } from 'chart.js';
import { onMounted, PropType } from 'vue';

export type ChartType = 'bar' | 'line';

export default {
  props: {
    chartId: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<ChartType>,
      default: 'line',
    },
    data: {
      type: Object as PropType<ChartData>,
      required: true,
    },
    options: {
      type: Object as PropType<ChartOptions>,
      required: true,
    },
    plugins: {
      type: Array as PropType<Record<string, string>[]>,
    },
  },
  setup(props: any) {
    onMounted(() => {
      // const canvas = <HTMLCanvasElement>document.getElementById(this.chartId);
      // const ctx = canvas.getContext('2d');
      // if (ctx === null) return;

      const options: ChartOptions = props.options;
      const data: ChartData = props.data;
      const type: ChartType = props.type;

      const chart = new Chart(props.chartId, { type, options, data });
    });
  },
};
</script>
