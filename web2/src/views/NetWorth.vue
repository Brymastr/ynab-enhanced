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
      <div class="min-h-400 bg-gray-300">
        <div class="xl:container mx-auto px-5 grid grid-cols-3 gap-x-5">
          <div class="hidden md:flex flex-col justify-center">
            <CurrentNetWorthSummary
              class="bg-gray-200 shadow-lg"
              v-if="selectedItem"
              :selectedItem="selectedItem"
              :forecast="selectedItem.index > netWorth.length - 1"
            />
          </div>
          <NetWorthGraph
            v-if="netWorth"
            class="col-span-3 md:col-span-2"
            :netWorth="filteredNetWorth"
            :forecast="filteredForecast"
            :combined="filteredCombined"
            :changeGraph="false"
            v-on:dateHighlighted="dateHighlighted"
          />
        </div>
      </div>

      <!-- stats area -->
      <div class="grid grid-cols-12 p-5 gap-5 xl:container xl:mx-auto">
        <NetWorthStats class="col-span-7" :netWorth="netWorth" />
        <NetWorthTable class="col-span-5 row-span-2 max-h-600" :netWorth="netWorth" />
        <MonthlyAverage class="col-span-7" :netWorth="netWorth" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import DateSelect from '@/components/General/DateSelect.vue';
import CurrentNetWorthSummary from '@/components/General/CurrentNetWorthSummary.vue';
import NetWorthGraph from '@/components/Graphs/NetWorth.vue';
import NetWorthStats from '@/components/Stats/NetWorth.vue';
import NetWorthTable from '@/components/Tables/NetWorth.vue';
import ReloadIcon from '@/components/Icons/ReloadIcon.vue';
import MonthlyAverage from '@/components/Graphs/MonthlyAverage.vue';
import { defineComponent, onMounted } from '@vue/runtime-core';
import useYnab from '@/composables/ynab';
import useSession from '@/composables/session';

export default defineComponent({
  components: {
    DateSelect,
    ReloadIcon,
    MonthlyAverage,
    NetWorthGraph,
    NetWorthStats,
    NetWorthTable,
    CurrentNetWorthSummary,
  },
  setup(props: any) {
    const {
      state: ynabState,
      getNetWorth,
      getForecast,
      getCombined,
      getDateList,
      getSelectedStartDate,
      getSelectedEndDate,
      getFilteredDateRange,
      loadMonthlyData,
    } = useYnab();

    const { state: sessionState } = useSession();
  },
});

// class NetWorth extends {
//   @State('loadingStatus', { namespace }) loading!: LoadingStatus;
//   @State('loadingNetWorthStatus', { namespace }) loadingNetWorth!: LoadingStatus;
//   @State('loadingForecastStatus', { namespace }) loadingForecast!: LoadingStatus;

//   @Getter('getNetWorth', { namespace }) getNetWorth!: () => WorthDate[];
//   @Getter('getForecast', { namespace }) getForecast!: () => WorthDate[];
//   @Getter('getDateList', { namespace }) getDates!: () => string[];
//   @Getter('getSelectedStartDate', { namespace }) getSelectedStartDate!: () => string;
//   @Getter('getSelectedEndDate', { namespace }) getSelectedEndDate!: () => string;
//   @Getter('getFilteredDateRange', { namespace }) getFilteredDateRange!: (
//     type: 'NetWorth' | 'Forecast' | 'Combined',
//   ) => WorthDate[];

//   get netWorth() {
//     return this.getNetWorth();
//   }

//   get forecast() {
//     return this.getForecast();
//   }

//   get combined(): WorthDate[] | null {
//     if (!this.netWorth || !this.forecast) return null;
//     return [...this.netWorth, ...this.forecast];
//   }

//   get dates() {
//     return this.getDates();
//   }

//   get filteredNetWorth() {
//     return this.getFilteredDateRange('NetWorth');
//   }

//   get filteredForecast() {
//     return this.getFilteredDateRange('Forecast');
//   }

//   get filteredCombined() {
//     return this.getFilteredDateRange('Combined');
//   }

//   @Action('loadMonthlyData', { namespace }) loadMonthlyData!: Function;

//   selectedItem: WorthDate | null = null;

//   dateHighlighted(item: WorthDate) {
//     this.selectedItem = item;
//   }
// }
</script>
