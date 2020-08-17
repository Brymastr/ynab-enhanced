<template>
  <div class="container">
    <div class="loading" v-if="!monthlyNetWorth">Loading...</div>
    <NetWorthGraph class="graphs" v-else :dateList="dateList" :monthlyNetWorth="monthlyNetWorth" />
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
  private getMonthlyNetWorth!: Function;

  @Getter('getSelectedStartDate', { namespace })
  private getSelectedStartDate!: Function;

  private get getSelectedStartDateComputed() {
    return this.getSelectedStartDate();
  }

  @Getter('getSelectedEndDate', { namespace })
  private getSelectedEndDate!: Function;

  private get getSelectedEndDateComputed() {
    return this.getSelectedEndDate();
  }

  @Action('loadNetWorth', { namespace })
  private loadNetWorth!: Function;

  private monthlyNetWorth: WorthDate[] | null = null;

  @Watch('budgetId')
  @Watch('getSelectedStartDateComputed')
  @Watch('getSelectedEndDateComputed')
  private async rebuild() {
    let monthlyNetWorth: WorthDate[];
    monthlyNetWorth = this.getMonthlyNetWorth(this.budgetId);

    if (!monthlyNetWorth || monthlyNetWorth.length === 0) {
      await this.loadNetWorth();
      monthlyNetWorth = this.getMonthlyNetWorth(this.budgetId);
    }

    const start = this.getSelectedStartDate(this.budgetId);
    const end = this.getSelectedEndDate(this.budgetId);

    const filtered = this.filterDateRange(start, end, monthlyNetWorth);

    this.monthlyNetWorth = filtered;
  }

  private filterDateRange(start: string, end: string, all: WorthDate[]) {
    return all.filter(({ date }) => {
      const current = moment(date);
      return current.isBetween(moment(start), moment(end), undefined, '[]');
    });
  }

  private async mounted() {
    await this.rebuild();
  }

  private get dateList() {
    return this.getMonthlyNetWorth().map(({ date }) => date);
  }
}
</script>

<style scoped lang="scss">
.container {
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
