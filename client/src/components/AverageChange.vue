<template>
  <div class="container" v-if="monthlyNetWorth">
    <div class="title">Average Change</div>
    <div class="value">{{ decimal }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { WorthDate } from '../store/modules/ynab/types';

@Component
export default class AverageChange extends Vue {
  @Prop({ required: true }) protected monthlyNetWorth!: WorthDate[];

  get decimal() {
    const first = this.monthlyNetWorth[0].worth;
    const last = this.monthlyNetWorth[this.monthlyNetWorth.length - 1].worth;

    const numMonths = this.monthlyNetWorth.length;

    return this.formatCurrency((last - first) / numMonths);
  }

  private formatCurrency(cur: number) {
    const formatter = new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    });

    const result = formatter.format(Math.round(cur));

    return result.substring(0, result.length - 3);
  }
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  font-size: 1.2em;
}

.value {
  font-size: 1.8em;
}
</style>
