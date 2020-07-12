<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import { MonthlyNetWorth as MonthlyNetWorthType } from '../store/modules/netWorth/types';
import { Line, mixins } from 'vue-chartjs-typescript';
import 'chartjs-plugin-crosshair';
const namespace = 'netWorth';

@Component({
  extends: Line,
  mixins: [mixins.reactiveProp],
})
export default class HelloWorld extends Vue<Line> {
  @Prop({ required: true }) protected chartData: MonthlyNetWorthType;

  private options = {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index',
      intersect: false,
      caretPadding: 10,
      displayColors: false,
      callbacks: {
        label: (tooltipItem, data) => this.formatCurrency(tooltipItem.yLabel),
      },
    },
    hover: {
      mode: 'index',
      intersect: false,
    },
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
          color: '#6dff74', // crosshair line color
          width: 4, // crosshair line width
        },
        zoom: { enabled: false },
        snap: { enabled: true },
      },
    },
  };

  mounted() {
    this.renderChart(this.chartData, this.options);
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
