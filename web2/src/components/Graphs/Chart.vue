<template>
  <canvas :id="chartId"></canvas>
</template>

<script lang="ts">
import {
  ChartOptions,
  ChartData,
  Chart,
  LinearScale,
  CategoryScale,
  LineController,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  ChartType,
} from 'chart.js';
import { defineComponent, PropType, onMounted } from 'vue';
Chart.register(LinearScale);
Chart.register(CategoryScale);
Chart.register(LineController);
Chart.register(BarController);
Chart.register(PointElement);
Chart.register(LineElement);
Chart.register(BarElement);

interface Props {
  data: ChartData;
  chartId: string;
  options: ChartOptions;
  type: ChartType;
  plugins?: Record<string, string>[];
}

export default defineComponent({
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
  setup(props: Props) {
    onMounted(() => {
      const options: ChartOptions = props.options;
      const data: ChartData = props.data;
      const type: ChartType = props.type;

      const chart = new Chart(props.chartId, { type, options, data });
    });
  },
});
</script>
