<template>
  <div
    class="flex flex-col text-xl gap-y-3 pb-3 bg-gray-200 shadow-lg rounded-sm min-h-300"
  >
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
import { WorthDate } from "@/composables/types";
import BarGraph from "@/components/Graphs/BarGraph.vue";
import { formatCurrency } from "../../services/helper";
import { BLUE } from "../../colors";
import { computed, defineComponent, PropType } from "vue";
import { ChartData, ChartDataset, ChartOptions } from "chart.js";
import { getDiffByMonth } from "@/composables/netWorth";

interface Props {
  netWorth: WorthDate[];
}

export default defineComponent({
  name: "Monthly Average Graph",
  components: { BarGraph },
  props: {
    netWorth: {
      type: Object as PropType<WorthDate[]>,
      required: true,
    },
  },
  setup(props: Props) {
    function tickCallback(tickValue: string | number) {
      return formatCurrency(tickValue, false);
    }

    const labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const diffByMonth = computed(() => getDiffByMonth(props.netWorth));

    const data = computed(() => {
      const data = diffByMonth.value;

      const datasets: ChartDataset[] = [
        {
          label: "Average Gain by Month",
          data,
          backgroundColor: "rgb(98, 179, 237, 0.5)",
          pointBackgroundColor: "rgb(98, 179, 237)",
        },
      ];

      const chartData: ChartData = {
        labels,
        datasets,
      };

      return chartData;
    });

    const options = computed(() => {
      const options: ChartOptions = {
        layout: {
          padding: {
            right: 10,
            left: 10,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        events: ["mousemove", "click"],
        hover: {
          mode: "index",
          intersect: false,
        },
        elements: {
          point: {
            pointStyle: "circle",
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
              drawBorder: false,
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
        },
      };

      return options;
    });

    return { data, options };
  },
});
</script>

<style lang="scss" scoped>
.bar-graph {
  clip-path: inset(8px 0);
}
</style>
