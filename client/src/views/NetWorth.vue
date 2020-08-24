<template>
  <div class="containerr">
    <div class="loading" v-if="!monthlyNetWorth">Loading...</div>
    <NetWorthGraph
      v-else
      class="graphs"
      :dateList="dateList"
      :monthlyNetWorth="monthlyNetWorth"
      :monthlyForecast="monthlyForecast"
    />
    <NetWorthStats class="stats" :monthlyNetWorth="monthlyNetWorth" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import { WorthDate } from '../store/modules/ynab/types';
import NetWorthGraph from '@/components/Graphs/NetWorth.vue';
import NetWorthStats from '@/components/Stats/NetWorth.vue';
import moment from 'moment';
const namespace = 'ynab';

@Component({
  components: {
    NetWorthGraph,
    NetWorthStats,
  },
})
export default class NetWorth extends Vue {
  @State('selectedBudgetId', { namespace })
  private budgetId!: string;

  @Getter('getMonthlyNetWorth', { namespace })
  private getMonthlyNetWorth!: (budgetId?: string) => WorthDate[];

  @Getter('getMonthlyForecast', { namespace })
  private getMonthlyForecast!: (budgetId?: string) => WorthDate[];

  @Getter('getSelectedStartDate', { namespace })
  private getSelectedStartDate!: (budgetId?: string) => string;

  private get getSelectedStartDateComputed() {
    return this.getSelectedStartDate();
  }

  @Getter('getSelectedEndDate', { namespace })
  private getSelectedEndDate!: (budgetId?: string) => string;

  private get getSelectedEndDateComputed() {
    return this.getSelectedEndDate();
  }

  @Action('loadNetWorth', { namespace })
  private loadNetWorth!: Function;

  @Action('loadForecast', { namespace })
  private loadForecast!: Function;

  private monthlyNetWorth: WorthDate[] | null = null;
  private monthlyForecast: WorthDate[] | null = null;

  @Watch('budgetId')
  @Watch('getSelectedStartDateComputed')
  @Watch('getSelectedEndDateComputed')
  private async rebuild() {
    let monthlyNetWorth: WorthDate[] = this.getMonthlyNetWorth(this.budgetId);

    if (!monthlyNetWorth || monthlyNetWorth.length === 0) {
      await this.loadNetWorth();
      monthlyNetWorth = this.getMonthlyNetWorth(this.budgetId);
    }

    let monthlyForecast: WorthDate[] = this.getMonthlyForecast(this.budgetId);

    if (!monthlyForecast || monthlyForecast.length === 0) {
      await this.loadForecast();
      monthlyForecast = this.getMonthlyForecast(this.budgetId);
    }

    const start = this.getSelectedStartDate(this.budgetId);
    const end = this.getSelectedEndDate(this.budgetId);

    this.monthlyNetWorth = this.filterDateRange(start, end, monthlyNetWorth);
    this.monthlyForecast = this.filterDateRange(start, end, monthlyForecast);
  }

  private filterDateRange(start: string, end: string, all: WorthDate[]) {
    return all.filter(({ date }) => {
      const current = moment(date);
      return current.isBetween(moment(start), moment(end), undefined, '[]');
    });
  }

  private get dateList() {
    const netWorth = this.getMonthlyNetWorth().map(({ date }) => date);
    const forecast = this.getMonthlyForecast().map(({ date }) => date);
    return netWorth.concat(forecast);
  }

  private async mounted() {
    await this.rebuild();
  }
}
</script>

<style scoped lang="scss">
.containerr {
  > div {
    margin: 10px 10px 0 10px;
  }
}

// .stats {
//   height: 25%;
// }

.graphs {
  height: 75vh;
  min-height: 400px;
}
</style>
