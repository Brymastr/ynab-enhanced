<template>
  <div class="font-thin">
    <!-- header fix -->
    <div class="invisible h-header min-h-header"></div>

    <!-- loading replacement for utility bar -->
    <div
      class="h-header bg-blue-400 text-white text-center flex flex-col justify-center"
      v-if="!combined"
    >
      Loading...
    </div>

    <!-- utility bar -->
    <div class="h-header bg-blue-400 text-white" v-if="combined">
      <div class="xl:container mx-auto px-5 flex justify-between items-center">
        <DateSelect :dates="dates" />
        <ReloadIcon
          class="pl-3 h-full items-center"
          id="reload-net-worth"
          label="Reload Data"
          :rotate="loading === 'loading'"
          :ready="loadingNetWorth === 'ready' && loadingForecast === 'ready'"
          :action="loadMonthlyData"
          size="small"
        />
      </div>
    </div>

    <!-- main section -->
    <section class="flex-grow" v-if="combined">
      <!-- graph area -->
      <div class="h-1/2 min-h-400 bg-gray-300">
        <div class="xl:container mx-auto px-5 grid grid-cols-3 gap-x-5">
          <div class="flex flex-col justify-center">
            <CurrentNetWorthSummary
              class="bg-gray-200 shadow-lg"
              v-if="selectedItem"
              :selectedItem="selectedItem"
              :forecast="selectedItem.index > netWorth.length - 1"
            />
          </div>
          <NetWorthGraph
            v-if="netWorth"
            class="col-span-2"
            :netWorth="filteredNetWorth"
            :forecast="filteredForecast"
            :combined="filteredCombined"
            :changeGraph="false"
            v-on:dateHighlighted="dateHighlighted"
          />
        </div>
      </div>

      <!-- stats area -->
      <div class="xl:container mx-auto">
        <NetWorthStats class="px-5" :monthlyNetWorth="netWorth" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import { WorthDate, LoadingStatus } from '../store/modules/ynab/types';
import DateSelect from '@/components/General/DateSelect.vue';
import CurrentNetWorthSummary from '@/components/General/CurrentNetWorthSummary.vue';
import NetWorthGraph from '@/components/Graphs/NetWorth.vue';
import NetWorthStats from '@/components/Stats/NetWorth.vue';
import ReloadIcon from '@/components/Icons/ReloadIcon.vue';
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
  @State('loadingStatus', { namespace }) loading!: LoadingStatus;
  @State('loadingNetWorthStatus', { namespace }) loadingNetWorth!: LoadingStatus;
  @State('loadingForecastStatus', { namespace }) loadingForecast!: LoadingStatus;

  @Getter('getNetWorth', { namespace }) getNetWorth!: () => WorthDate[];
  @Getter('getForecast', { namespace }) getForecast!: () => WorthDate[];
  @Getter('getDateList', { namespace }) getDates!: () => string[];
  @Getter('getSelectedStartDate', { namespace }) getSelectedStartDate!: () => string;
  @Getter('getSelectedEndDate', { namespace }) getSelectedEndDate!: () => string;
  @Getter('getFilteredDateRange', { namespace }) getFilteredDateRange!: (
    type: 'NetWorth' | 'Forecast' | 'Combined',
  ) => WorthDate[];

  get netWorth() {
    return this.getNetWorth();
  }

  get forecast() {
    return this.getForecast();
  }

  get combined(): WorthDate[] | null {
    if (!this.netWorth || !this.forecast) return null;
    return [...this.netWorth, ...this.forecast];
  }

  get dates() {
    return this.getDates();
  }

  get filteredNetWorth() {
    return this.getFilteredDateRange('NetWorth');
  }

  get filteredForecast() {
    return this.getFilteredDateRange('Forecast');
  }

  get filteredCombined() {
    return this.getFilteredDateRange('Combined');
  }

  @Action('loadMonthlyData', { namespace }) loadMonthlyData!: Function;

  selectedItem: WorthDate | null = null;

  dateHighlighted(item: WorthDate) {
    this.selectedItem = item;
  }
}
</script>
