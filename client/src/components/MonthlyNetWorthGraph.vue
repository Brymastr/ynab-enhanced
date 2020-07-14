<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import { WorthDate } from '../store/modules/netWorth/types';
import { Line, mixins } from 'vue-chartjs-typescript';
import 'chartjs-plugin-crosshair';
const namespace = 'netWorth';

@Component({
  extends: Line,
  mixins: [mixins.reactiveProp],
})
export default class HelloWorld extends Vue<Line> {
  @Prop({ required: true }) protected chartData: Record<string, any>;
  @Prop({ required: true }) protected monthlyNetWorth: WorthDate[];

  private selectedDateIndex: number = null;

  private options = {
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
    onHover: this.onHover,
    elements: {
      point: {
        pointStyle: 'circle',
      },
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            callback: this.formatCurrency,
          },
          scaleLabel: {
            display: false,
          },
        },
      ],
      xAxes: [
        {
          scaleLabel: {
            display: false,
          },
        },
      ],
    },
    plugins: {
      crosshair: {
        line: {
          color: 'rgba(229, 229, 229, 0.5)',
          width: 5,
        },
        zoom: { enabled: false },
        snap: { enabled: true },
      },
    },
  };

  mounted() {
    this.renderChart(this.chartData, this.options);
  }

  onHover(event, item) {
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

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
