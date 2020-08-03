<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { WorthDate } from '../store/modules/ynab/types';
import { Line, mixins } from 'vue-chartjs';
import { ChartOptions } from 'chart.js';
import ChartBands from '../ChartBands';
import { BLUE, GREY } from '../colors';

@Component({
  extends: Line,
  mixins: [mixins.reactiveProp],
})
export default class MonthlyNetWorthGraph extends Vue<Line> {
  @Prop({ required: true }) protected chartData!: Record<string, any>;
  @Prop({ required: true }) protected monthlyNetWorth!: WorthDate[];

  private selectedDateIndex = 0;

  private options: ChartOptions = {
    layout: {
      padding: {
        right: 35,
      },
    },
    legend: {
      display: false,
    },
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      enabled: false,
    },
    events: ['mousemove', 'click'],
    hover: {
      mode: 'index',
      intersect: false,
    },
    onHover: this.onHover,
    elements: {
      point: {
        pointStyle: 'circle',
        borderWidth: 0,
        backgroundColor: BLUE,
      },
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            callback: this.formatCurrency,
            fontFamily: 'monospace',
          },
          gridLines: {
            drawBorder: false,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            display: false,
          },
          gridLines: {
            display: false,
          },
        },
      ],
    },
    plugins: {
      crosshair: {
        line: {
          color: GREY,
          width: 0.5,
        },
        zoom: { enabled: false },
        snap: { enabled: true },
        sync: { enabled: true },
      },
    },
  };

  mounted() {
    this.renderChart(this.chartData, this.options);
  }

  onHover(event: any, item: any) {
    if (item.length === 0) return;

    const index = item[0]._index;
    if (index === this.selectedDateIndex) return;

    this.selectedDateIndex = index;

    const selected = this.monthlyNetWorth[index];
    if (index > 0) selected.previous = this.monthlyNetWorth[index - 1];

    this.$emit('monthSelected', selected);
  }

  formatCurrency(cur: number) {
    const formatter = new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    });

    const result = formatter.format(cur);

    return result.substring(0, result.length - 3);
  }
}
</script>
