<template>
  <div class="container" v-if="monthlyNetWorth">
    <div class="title">Best and Worst Months</div>
    <div class="value">
      <Currency :number="best" />
      <div class="divider">/</div>
      <Currency :number="worst" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { WorthDate } from '../../store/modules/ynab/types';
import Currency from '@/components/General/Currency.vue';

@Component({
  components: { Currency },
})
export default class BestWorst extends Vue {
  @Prop({ required: true }) protected monthlyNetWorth!: WorthDate[];

  private diffs() {
    const amounts = this.monthlyNetWorth.map(({ worth }) => worth);
    return amounts.map((amount, index) => {
      if (index === 0) return 0;
      else {
        return amount - amounts[index - 1];
      }
    });
  }

  get best() {
    return Math.max(...this.diffs());
  }

  get worst() {
    return Math.min(...this.diffs());
  }
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 1.2em;
}

.value {
  font-size: 1.8em;
  display: flex;
  justify-content: center;

  > .divider {
    padding: 0 10px;
  }
}
</style>
