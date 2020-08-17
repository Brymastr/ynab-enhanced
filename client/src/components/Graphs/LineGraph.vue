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
  @Prop({ required: true }) protected options!: ChartOptions;
  @Prop({ required: false }) protected plugins!: any[];

  public addPlugin!: (plugin?: object) => void;
  public renderChart!: (chartData: ChartData, options: ChartOptions) => void;

  mounted() {
    if (this.plugins) {
      this.plugins.forEach(plugin => this.addPlugin(plugin));
    }
    this.renderChart(this.chartData, this.options);
  }
}
</script>
