<template>
  <Chart type="line" :chartId="chartId" :data="data" :options="options" />
</template>


<script lang="ts">
import { ChartOptions, ChartData, Plugin } from 'chart.js';
import { defineComponent, PropType } from 'vue';
import Chart from '@/components/Graphs/Chart.vue';

export default defineComponent({
  name: 'Line Graph',
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
      type: Array as PropType<Plugin[]>,
    },
  },
});
</script>
