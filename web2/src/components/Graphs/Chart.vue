<template>
  <div class="relative">
    <canvas :id="chartId" class="absolute h-full w-full"></canvas>
  </div>
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
  ChartConfiguration,
  Plugin,
} from 'chart.js';
import { defineComponent, PropType, onMounted, watch } from 'vue';
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
  plugins: Plugin[];
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
      type: Array as PropType<Plugin[]>,
      default: [],
    },
  },
  setup(props: Props) {
    let chart: Chart;

    onMounted(() => {
      const options: ChartOptions = props.options;
      const data: ChartData = props.data;
      const type: ChartType = props.type;
      const plugins: Plugin[] = props.plugins;
      const chartConfig: ChartConfiguration = {
        data,
        options,
        type,
        plugins,
      };
      chart = new Chart(props.chartId, chartConfig);
    });

    watch(
      () => props.data,
      (_, newData) => {
        chart.data = newData;
        chart.update();
      },
    );
  },
});
</script>
