<template>
  <div class="font-thin">
    <!-- header fix -->
    <div class="invisible h-header"></div>

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
            label="Net Worth"
            :rotate="loadingNetWorthStatus === 'loading'"
            :ready="loadingNetWorthStatus === 'ready'"
            :action="loadNetWorth"
            size="small"
          />
          <ReloadIcon
            class="pl-3 h-full items-center"
            id="reload-forecast"
            label="Forecast"
            :rotate="loadingForecastStatus === 'loading'"
            :ready="loadingForecastStatus === 'ready'"
            :action="loadForecast"
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
              class="bg-gray-200 shadow-lg rounded-sm"
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

  @Action('loadNetWorth', { namespace })
  private loadNetWorth!: Function;

  @Action('loadForecast', { namespace })
  private loadForecast!: Function;

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

  @Watch('budgetId')
  @Watch('getSelectedStartDateComputed')
  @Watch('getSelectedEndDateComputed')
  private rebuild() {
    if (this.loadingNetWorthStatus === 'loading' || this.loadingForecastStatus === 'loading') {
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

  private get ready() {
    return (
      this.monthlyNetWorth &&
      this.monthlyForecast &&
      this.loadingNetWorthStatus !== 'loading' &&
      this.loadingForecastStatus !== 'loading'
    );
  }

  mounted() {
    this.rebuild();
  }
}
</script>
