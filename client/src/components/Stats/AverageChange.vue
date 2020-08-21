<template>
  <div class="flex flex-col items-center" v-if="monthlyNetWorth">
    <div class="text-xl">Average Change</div>
    <Currency class="text-3xl -mt-2" :number="value" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { WorthDate } from '../../store/modules/ynab/types';
import Currency from '@/components/General/Currency.vue';

@Component({
  components: { Currency },
})
export default class AverageChange extends Vue {
  @Prop({ required: true }) protected monthlyNetWorth!: WorthDate[];

  get value() {
    const first = this.monthlyNetWorth[0].worth;
    const last = this.monthlyNetWorth[this.monthlyNetWorth.length - 1].worth;

    const numMonths = this.monthlyNetWorth.length;

    return (last - first) / numMonths;
  }
}
</script>
