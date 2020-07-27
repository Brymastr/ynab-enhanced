<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { WorthDate } from '../store/modules/ynab/types';
import { Line, mixins } from 'vue-chartjs';
import { BLUE, GREY } from '../colors';
import ChartBand from '../ChartBands';
import { ChartOptions, ChartData } from 'chart.js';

@Component({
  extends: Line,
  mixins: [mixins.reactiveProp],
})
export default class MonthlyChangeGraph extends Vue<Line> {
  @Prop({ required: true }) protected chartData!: ChartData;
  @Prop({ required: true }) protected monthlyNetWorth!: WorthDate[];

  private selectedDateIndex = 0;

  private options: ChartOptions = {
    layout: {
      padding: {
        right: 15,
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
      yAxes: [
        {
          ticks: {
            callback: this.formatTickLabels,
            fontFamily: 'monospace',
          },
          gridLines: {
            drawBorder: false,
            lineWidth: 0,
            zeroLineWidth: 1,
          },
        },
      ],
      xAxes: [
        {
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
    this.addPlugin(ChartBand);
    this.renderChart(this.chartData, this.options);
  }

  formatTickLabels(cur: number) {
    const formatter = new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    });

    const nums = this.monthlyNetWorth.map(({ worth }) => worth);
    const largestNum = Math.max(...nums);

    const largestTickLabelLength = formatter.format(largestNum).length - 2;

    let result = '';

    if (cur === 0) result = formatter.format(cur);

    return result.substring(0, result.length - 3).padStart(largestTickLabelLength, ' ');
  }
}
</script>
