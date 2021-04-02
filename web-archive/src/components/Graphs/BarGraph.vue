<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Bar, mixins } from 'vue-chartjs';
import { ChartOptions, ChartData } from 'chart.js';

@Component({
  extends: Bar,
  mixins: [mixins.reactiveProp],
})
export default class NetWorthGraph extends Vue {
  @Prop({ required: true }) protected chartData!: ChartData;
  @Prop({ required: true }) protected options!: ChartOptions;
  @Prop({ required: false }) protected plugins!: Record<string, string>[];

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
