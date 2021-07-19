<template>
  <div class="font-thin">
    <!-- header fix -->
    <div class="invisible h-header min-h-header"></div>

    <!-- loading replacement for utility bar -->
    <Spinner :on="!ready">Loading YNAB Data...</Spinner>

    <!-- main section -->
    <section class="flex-grow" v-if="ready">
      <ForecastGraph
        class="col-span-3 md:col-span-2 min-h-540 md:min-h-0 order-1 md:order-2"
        :netWorth="netWorth"
        :forecast="forecast"
        :combined="combined"
        v-on:dateHighlighted="dateHighlighted"
      />
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import Spinner from '@/components/General/Spinner.vue';
import ForecastGraph from '@/components/Graphs/Forecast.vue';
import useYnab from '@/composables/ynab';
import { getData as getDummyData } from '@/composables/dummyGraph';
import { WorthDate } from '@/composables/types';
import useSettings from '@/composables/settings';

export default defineComponent({
  name: 'Forecast',
  components: {
    Spinner,
    ForecastGraph,
  },
  setup() {
    const { getForecast } = useYnab();
    const { isDummy: isDummyFlag } = useSettings();

    const netWorth = ref<WorthDate[] | null>(null);

    function useRealData() {
      const data = getForecast.value ?? [];
      netWorth.value = data;
    }

    function useDummyData() {
      const data = getDummyData();
      netWorth.value = data;
    }

    function reload() {
      isDummyFlag.value ? useDummyData() : useRealData();
    }

    watch(
      () => isDummyFlag.value,
      () => reload(),
    );

    reload();

    const ready = computed(() => netWorth.value && netWorth.value.length > 0);

    return {
      ready,
    };
  },
});
</script>

<style>
</style>
