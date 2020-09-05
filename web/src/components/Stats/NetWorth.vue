<template>
  <div class="flex flex-wrap text-xl gap-y-3 px-3 bg-gray-200 shadow-lg rounded-sm">
    <NetChange class="w-full sm:w-1/2" :monthlyNetWorth="netWorth" />
    <PositiveNegative class="w-full sm:w-1/2" :monthlyNetWorth="netWorth" />
    <AverageChange class="w-full sm:w-1/2" :monthlyNetWorth="netWorth" />
    <BestWorst class="w-full sm:w-1/2" :monthlyNetWorth="netWorth" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { WorthDate } from '../../store/modules/ynab/types';
import NetChange from '@/components/Stats/NetChange.vue';
import AverageChange from '@/components/Stats/AverageChange.vue';
import PositiveNegative from '@/components/Stats/PositiveNegative.vue';
import BestWorst from '@/components/Stats/BestWorst.vue';
import 'chartjs-plugin-crosshair';

@Component({
  components: { NetChange, AverageChange, PositiveNegative, BestWorst },
})
export default class NetWorth extends Vue {
  @Prop({ required: true }) protected netWorth!: WorthDate[];
}
</script>
