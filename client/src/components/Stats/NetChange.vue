<template>
  <div class="container" v-if="monthlyNetWorth">
    <div class="title">Net Change</div>
    <div class="value" :class="{ negative: decimalNum < 0 }">
      <Arrow :direction="decimalNum >= 0 ? 'up' : 'down'" />
      <div>{{ decimalString }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { WorthDate } from '../../store/modules/ynab/types';
import Arrow from '@/components/Icons/ArrowUpIcon.vue';

@Component({
  components: { Arrow },
})
export default class NetChange extends Vue {
  @Prop({ required: true }) protected monthlyNetWorth!: WorthDate[];

  private decimal() {
    const first = this.monthlyNetWorth[0].worth;
    const last = this.monthlyNetWorth[this.monthlyNetWorth.length - 1].worth;

    return last - first;
  }

  get decimalNum() {
    return this.decimal();
  }

  get decimalString() {
    const num = Math.abs(this.decimal());

    return this.formatCurrency(num);
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
  display: flex;
  justify-content: center;
  text-align: center;
  color: var(--positive-color);
}

.positive {
  color: var(--positive-color);
}

.negative {
  color: var(--negative-color);
}
</style>
