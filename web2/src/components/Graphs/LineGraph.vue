<template>
  <Chart type="line" :chartId="chartId" :data="data" :options="options" />
</template>


<script lang="ts">
import Chart from '@/components/Graphs/Chart.vue';
import { ChartOptions, ChartData } from 'chart.js';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  components: { Chart },
  props: {
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
});
</script>
