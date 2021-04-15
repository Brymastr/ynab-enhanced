<template>
  <Chart type="bar" :chartId="chartId" :data="data" :options="options" />
</template>


<script lang="ts">
import { ChartOptions, ChartData } from 'chart.js';
import { defineComponent, PropType } from 'vue';
import Chart from '@/components/Graphs/Chart.vue';

export default defineComponent({
  name: 'Bar Graph',
  components: { Chart },
  props: {
    data: {
      type: Object as PropType<ChartData>,
      required: true,
    },
    chartId: {
      type: String,
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
});
</script>
