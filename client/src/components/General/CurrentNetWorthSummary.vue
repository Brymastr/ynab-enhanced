<template>
  <div class="grid grid-cols-2 text-xl gap-5 leading-none p-3">
    <div class="self-center">Date:</div>
    <div class="text-right self-center text-2xl whitespace-no-wrap">{{ date }}</div>
    <div class="self-center">Net Worth:</div>
    <Currency
      class="justify-end self-center text-2xl"
      :number="worth"
      :arrow="false"
      :full="true"
    />
    <div class="self-center">Change:</div>
    <Currency
      class="justify-end self-center text-2xl"
      v-if="difference"
      :number="difference"
      :arrow="true"
      :full="true"
    />
    <Currency
      class="justify-end self-center text-2xl"
      v-else
      :number="0"
      :arrow="false"
      :full="false"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { WorthDate } from '../../store/modules/ynab/types';
import { formatDate, formatCurrency } from '../../services/helper';
import Currency from '@/components/General/Currency.vue';

@Component({
  components: { Currency },
})
export default class CurrentNetWorthSummary extends Vue {
  @Prop({ required: true }) protected selectedItem!: WorthDate;

  private get difference() {
    if (this.selectedItem.previous !== undefined) {
      return this.selectedItem.worth - this.selectedItem.previous.worth;
    } else return null;
  }

  private get date() {
    return formatDate(this.selectedItem.date);
  }

  private get worth() {
    return this.selectedItem.worth;
  }
}
</script>
