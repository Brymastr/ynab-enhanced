<template>
  <div class="font-thin">
    <!-- header fix -->
    <div class="invisible h-header min-h-header"></div>

    <!-- loading replacement for utility bar -->
    <div
      class="h-header bg-blue-400 text-white text-center flex flex-col justify-center"
      v-if="!ready"
    >
      Loading...
    </div>

    <!-- utility bar -->
    <div class="h-header bg-blue-400 text-white" v-if="ready">
      <div class="xl:container mx-auto px-5 flex justify-between items-center">
        <DateSelect :dates="dateList" :budgetId="budgetId" />
        <div class="flex items-center h-header">
          <ReloadIcon
            class="pl-3 h-full items-center"
            id="reload-net-worth"
            label="Reload Data"
            :rotate="loadingNetWorthStatus === 'loading' || loadingForecastStatus === 'loading'"
            :ready="loadingNetWorthStatus === 'ready' && loadingForecastStatus === 'ready'"
            :action="reload.bind(this)"
            size="small"
          />
        </div>
      </div>
    </div>

    <!-- main section -->
    <section class="flex-grow" v-if="ready">
      <!-- graph area -->
      <div class="h-1/2 min-h-400 bg-gray-300">
        <div class="xl:container mx-auto px-5 grid grid-cols-3 gap-x-5">
          <div class="flex flex-col justify-center">
            <CurrentNetWorthSummary
              class="bg-gray-200 shadow-lg"
              v-if="selectedItem"
              :selectedItem="selectedItem"
              :forecast="selectedItem.index > monthlyNetWorth.length - 1"
            />
          </div>
          <NetWorthGraph
            v-if="monthlyNetWorth"
            class="col-span-2"
            :dateList="dateList"
            :monthlyNetWorth="monthlyNetWorth"
            :monthlyForecast="monthlyForecast"
            :monthlyChange="false"
            v-on:dateHighlighted="dateHighlighted"
          />
        </div>
      </div>

      <!-- stats area -->
      <div class="xl:container mx-auto">
        <NetWorthStats class="px-5" :monthlyNetWorth="monthlyNetWorth" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import { WorthDate, LoadingStatus } from '../store/modules/ynab/types';
import DateSelect from '@/components/General/DateSelect.vue';
import CurrentNetWorthSummary from '@/components/General/CurrentNetWorthSummary.vue';
import NetWorthGraph from '@/components/Graphs/NetWorth.vue';
import NetWorthStats from '@/components/Stats/NetWorth.vue';
import ReloadIcon from '@/components/Icons/ReloadIcon.vue';
import moment from 'moment';
const namespace = 'ynab';

@Component({
  components: {
    DateSelect,
    ReloadIcon,
    NetWorthGraph,
    NetWorthStats,
    CurrentNetWorthSummary,
  },
})
export default class NetWorth extends Vue {
  @State('loadingNetWorthStatus', { namespace })
  private loadingNetWorthStatus!: LoadingStatus;
  @State('loadingForecastStatus', { namespace })
  private loadingForecastStatus!: LoadingStatus;
  @State('selectedBudgetId', { namespace })
  private budgetId!: string;

  @Getter('getMonthlyNetWorth', { namespace })
  private getMonthlyNetWorth!: (budgetId?: string) => WorthDate[];
  @Getter('getMonthlyForecast', { namespace })
  private getMonthlyForecast!: (budgetId?: string) => WorthDate[];
  @Getter('getSelectedStartDate', { namespace })
  private getSelectedStartDate!: (budgetId?: string) => string;
  @Getter('getSelectedEndDate', { namespace })
  private getSelectedEndDate!: (budgetId?: string) => string;

  @Action('loadNetWorth', { namespace })
  private loadNetWorth!: Function;
  @Action('loadForecast', { namespace })
  private loadForecast!: Function;

  private get getSelectedStartDateComputed() {
    return this.getSelectedStartDate();
  }

  private get getSelectedEndDateComputed() {
    return this.getSelectedEndDate();
  }

  private monthlyNetWorth: WorthDate[] | null = null;
  private monthlyForecast: WorthDate[] | null = null;
  private selectedItem: WorthDate | null = null;

  @Watch('loadingNetWorthStatus')
  private netWorthLoaded(newStatus: LoadingStatus) {
    if (newStatus !== 'complete') return;
    this.rebuild();
  }

  @Watch('loadingForecastStatus')
  private forecastLoaded(newStatus: LoadingStatus) {
    if (newStatus !== 'complete') return;
    this.rebuild();
  }

  @Watch('getSelectedStartDateComputed')
  @Watch('getSelectedEndDateComputed')
  @Watch('ready')
  private rebuild() {
    if (this.loading) {
      return;
    }
    const monthlyNetWorth: WorthDate[] = this.getMonthlyNetWorth();
    const monthlyForecast: WorthDate[] = this.getMonthlyForecast();

    const start = this.getSelectedStartDate();
    const end = this.getSelectedEndDate();

    this.monthlyNetWorth = this.filterDateRange(start, end, monthlyNetWorth);
    this.monthlyForecast = this.filterDateRange(start, end, monthlyForecast);
    this.selectedItem = this.monthlyNetWorth[this.monthlyNetWorth.length - 1];
  }

  private reload() {
    this.loadNetWorth();
    this.loadForecast();
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

  private dateHighlighted(item: WorthDate) {
    this.selectedItem = item;
  }

  private get loading() {
    return this.loadingNetWorthStatus === 'loading' || this.loadingForecastStatus === 'loading';
  }

  mounted() {
    this.rebuild();
  }

  /** events */
  private ready = false;

  @Watch('budgetId')
  budgetChanged() {
    this.ready = false;
  }

  @Watch('monthlyNetWorth')
  @Watch('monthlyForecast')
  finishedLoading() {
    if (this.loading) return;
    this.ready = true;
  }
}
</script>
