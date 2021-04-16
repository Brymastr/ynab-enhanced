<template>
  <div
    class="flex flex-row self-start flex-wrap text-xl gap-y-3 pb-3 bg-gray-200 shadow-lg rounded-sm"
  >
    <div class="h-0 text-gray-200 bg-gray-800 p-2 rounded-t-sm w-full">Summary</div>
    <NetChange class="w-full sm:w-1/2" :netWorth="netWorth" />
    <PositiveNegative class="w-full sm:w-1/2" :netWorth="netWorth" />
    <AverageChange class="w-full sm:w-1/2" :netWorth="netWorth" />
    <BestWorst class="w-full sm:w-1/2" :netWorth="netWorth" />
  </div>
</template>

<script lang="ts">
import NetChange from '@/components/Stats/NetChange.vue';
import AverageChange from '@/components/Stats/AverageChange.vue';
import PositiveNegative from '@/components/Stats/PositiveNegative.vue';
import BestWorst from '@/components/Stats/BestWorst.vue';
import { defineComponent, PropType } from 'vue';
import { WorthDate } from '@/composables/types';

export default defineComponent({
  name: 'Net Worth Stat',
  components: { NetChange, AverageChange, PositiveNegative, BestWorst },
  props: {
    netWorth: {
      type: Object as PropType<WorthDate[]>,
      required: true,
    },
  },
});
</script>
