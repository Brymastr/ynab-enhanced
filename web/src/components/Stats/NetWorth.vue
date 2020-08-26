<template>
  <div class="flex justify-between">
    <NetChange :monthlyNetWorth="monthlyNetWorth" />
    <AverageChange :monthlyNetWorth="monthlyNetWorth" />
    <PositiveNegative :monthlyNetWorth="monthlyNetWorth" />
    <BestWorst :monthlyNetWorth="monthlyNetWorth" />
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
  @Prop({ required: true }) protected monthlyNetWorth!: WorthDate[];
}
</script>
