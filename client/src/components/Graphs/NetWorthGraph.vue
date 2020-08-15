<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { WorthDate } from '../../store/modules/ynab/types';
import { Line, mixins } from 'vue-chartjs';
import { ChartOptions, ChartData } from 'chart.js';
import { BLUE, GREY } from '../../colors';

@Component({
  extends: Line,
  mixins: [mixins.reactiveProp],
})
export default class NetWorthGraph extends Vue {
  @Prop({ required: true }) protected chartData!: ChartData;
  @Prop({ required: true }) protected monthlyNetWorth!: WorthDate[];
  @Prop({ required: true }) protected tickCharacters!: number;

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
            beginAtZero: false,
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

  public renderChart!: (chartData: ChartData, options: ChartOptions) => void;

  mounted() {
    this.renderChart(this.chartData, this.options);
  }

  onHover(event: MouseEvent, activeElements: Array<{ _index: number }>) {
    if (activeElements.length === 0) return;

    const index = activeElements[0]._index;
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

    return result.substring(0, result.length - 3).padStart(this.tickCharacters, ' ');
  }
}
</script>

<style lang="scss" scoped>
.monthly-net-worth-graph {
  grid-area: net-worth-graph;
  margin-bottom: -20px;
  min-height: 250px;
  min-width: 0;
}
</style>
