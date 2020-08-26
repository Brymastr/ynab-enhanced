<template>
  <div class="grid grid-cols-2 text-xl gap-y-3 leading-none">
    <div class="text-gray-200 bg-gray-800 p-2">Net Worth</div>
    <div class="text-right text-blue-300 bg-gray-800 p-2">
      <span :class="{ invisible: !forecast }">Forecast</span>
    </div>

    <div class="self-center pl-2">Date:</div>
    <div class="text-right text-2xl whitespace-no-wrap pr-2">{{ date }}</div>

    <div class="self-center pl-2">Current:</div>
    <Currency class="justify-end text-2xl pr-2" :number="worth" :arrow="false" :full="true" />

    <div class="self-center pl-2 pb-2">Change:</div>
    <Currency
      class="justify-end text-2xl pr-2 pb-2"
      v-if="difference"
      :number="difference"
      :arrow="true"
      :full="true"
    />
    <Currency
      class="justify-end text-2xl pr-2 pb-2"
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
import { formatDate } from '../../services/helper';
import Currency from '@/components/General/Currency.vue';

@Component({
  components: { Currency },
})
export default class CurrentNetWorthSummary extends Vue {
  @Prop({ required: true }) protected selectedItem!: WorthDate;
  @Prop({ required: false, default: false }) protected forecast!: boolean;

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
