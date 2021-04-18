<template>
  <div class="font-thin">
    <!-- header fix -->
    <div class="invisible h-header min-h-header"></div>

    <!-- loading replacement for utility bar -->
    <div
      class="h-header bg-blue-400 text-white text-center flex flex-col justify-center"
      v-if="netWorth.length === 0"
    >
      Loading...
    </div>

    <!-- utility bar -->
    <div class="h-header bg-blue-400 text-white" v-if="netWorth.length > 0">
      <div class="xl:container mx-auto px-5 flex justify-between items-center">
        <DateSelect :dates="dateList" />
        <ReloadIcon
          class="pl-3 h-full items-center"
          id="reload-net-worth"
          :rotate="loading === 'loading'"
          :ready="loadingNetWorth === 'ready' && loadingForecast === 'ready'"
          :action="loadMonthlyData"
          size="small"
          >Reload Data</ReloadIcon
        >
      </div>
    </div>

    <!-- main section -->
    <section class="flex-grow" v-if="netWorth.length > 0">
      <!-- graph area -->
      <div class="bg-gray-300 min-h-540 md:h-screen-1/2">
        <div class="xl:container mx-auto px-5 grid grid-cols-3 gap-x-5 h-full">
          <div class="hidden md:flex flex-col justify-center">
            <CurrentNetWorthSummary
              class="bg-gray-200 shadow-lg"
              v-if="selectedItem"
              :selectedItem="selectedItem"
              :forecast="selectedItem.index > netWorth.length - 1"
            />
          </div>
          <NetWorthGraph
            v-if="netWorth.length > 0"
            class="col-span-3 md:col-span-2"
            :netWorth="netWorth"
            :forecast="forecast"
            :combined="combined"
            :changeGraph="false"
            v-on:dateHighlighted="dateHighlighted"
          />
        </div>
      </div>

      <!-- stats area -->
      <div class="grid grid-cols-12 p-5 gap-5 xl:container xl:mx-auto">
        <NetWorthStats class="col-span-7" v-if="netWorth.length > 0" :netWorth="netWorth" />
        <NetWorthTable class="col-span-5 row-span-2 max-h-600" :netWorth="netWorth" />
        <MonthlyAverage class="col-span-7" v-if="netWorth.length > 0" :netWorth="netWorth" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import DateSelect from '@/components/General/DateSelect.vue';
import CurrentNetWorthSummary from '@/components/General/CurrentNetWorthSummary.vue';
import NetWorthGraph from '@/components/Graphs/NetWorth.vue';
import NetWorthStats from '@/components/Stats/NetWorth.vue';
import NetWorthTable from '@/components/Tables/NetWorth.vue';
import ReloadIcon from '@/components/Icons/ReloadIcon.vue';
import MonthlyAverage from '@/components/Graphs/MonthlyAverage.vue';
import useYnab from '@/composables/ynab';
import { getData as getDummyData } from '@/composables/dummyGraph';
import { WorthDate } from '@/composables/types';
import useSettings from '@/composables/settings';

export default defineComponent({
  name: 'Net Worth',
  components: {
    DateSelect,
    ReloadIcon,
    MonthlyAverage,
    NetWorthGraph,
    NetWorthStats,
    NetWorthTable,
    CurrentNetWorthSummary,
  },
  setup() {
    const {
      getNetWorth,
      getForecast,
      getCombined,
      getDateList,
      getSelectedStartDate,
      getSelectedEndDate,
      getFilteredDateRange,
      loadMonthlyData,
      state,
    } = useYnab();

    const { isDummy: isDummyFlag } = useSettings();

    const selectedItem = ref<WorthDate | null>(null);

    function dateHighlighted(item: WorthDate) {
      selectedItem.value = item;
    }

    dateHighlighted(getNetWorth.value[getNetWorth.value.length - 1]);

    const netWorth = computed(() =>
      isDummyFlag.value ? getDummyData.value : getFilteredDateRange(getNetWorth.value),
    );

    return {
      netWorth,
      forecast: getForecast,
      combined: getCombined,
      dateList: getDateList,
      loading: state.loadingStatus,
      loadingNetWorth: state.loadingNetWorthStatus,
      loadingForecast: state.loadingForecastStatus,
      selectedStartDate: getSelectedStartDate,
      selectedEndDate: getSelectedEndDate,
      loadMonthlyData,
      dateHighlighted,
      selectedItem,
    };
  },
});
</script>
