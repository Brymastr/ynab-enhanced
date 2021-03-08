<template>
  <Chart type="bar" :chartId="chartId" :data="data" :options="options" />
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
  setup(props) {},
});

// export default class NetWorthGraph extends Vue {
//   @Prop({ required: true }) protected chartData!: ChartData;
//   @Prop({ required: true }) protected options!: ChartOptions;
//   @Prop({ required: false }) protected plugins!: Record<string, string>[];

//   public addPlugin!: (plugin?: object) => void;
//   public renderChart!: (chartData: ChartData, options: ChartOptions) => void;

//   mounted() {
//     if (this.plugins) {
//       this.plugins.forEach(plugin => this.addPlugin(plugin));
//     }
//     this.renderChart(this.chartData, this.options);
//   }
// }
</script>
