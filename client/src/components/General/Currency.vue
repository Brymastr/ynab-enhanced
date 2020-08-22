<template>
  <div
    :class="[
      { 'text-red-600': number < 0, 'text-blue-600': number >= 0 },
      'flex',
      'items-center',
      ' whitespace-no-wrap',
    ]"
  >
    <Arrow class="-mx-1" v-if="arrow === true" :direction="number >= 0 ? 'up' : 'down'" />
    <div>{{ value }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import numeral from 'numeral';
import Arrow from '@/components/Icons/ArrowUpIcon.vue';

@Component({
  components: { Arrow },
})
export default class Currency extends Vue {
  @Prop({ required: true }) private number!: number;
  @Prop({ required: false, default: true }) private arrow!: boolean;

  get value() {
    return this.formatCurrency(Math.abs(this.number));
  }

  private formatCurrency(cur: number) {
    const formatter = new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
    });

    if (cur > 10000) return numeral(cur).format('$0.0a');
    else {
      return formatter.format(Math.round(cur));
    }
  }
}
</script>
