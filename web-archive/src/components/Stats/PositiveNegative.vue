<template>
  <div class="flex flex-col items-center whitespace-no-wrap" v-if="monthlyNetWorth">
    <div class="text-xl">Positive and Negative</div>
    <div class="text-3xl -mt-2 flex flex-row">
      <div class="text-blue-600">+{{ positives }}</div>
      <div class="px-2">/</div>
      <div class="text-red-600">-{{ negatives }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { WorthDate } from '../../store/modules/ynab/types';

@Component
export default class AverageChange extends Vue {
  @Prop({ required: true }) protected monthlyNetWorth!: WorthDate[];

  private diffs() {
    return this.monthlyNetWorth.map(({ worth }, index, all) => {
      if (index === 0) return 0;
      return worth - all[index - 1].worth;
    });
  }

  get positives() {
    return this.diffs().reduce((acc, cur) => {
      if (cur >= 0) return acc + 1;
      else return acc;
    }, 0);
  }

  get negatives() {
    return this.diffs().reduce((acc, cur) => {
      if (cur < 0) return acc + 1;
      else return acc;
    }, 0);
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

  > .positives {
    color: var(--positive-color);
  }

  > .negatives {
    color: var(--negative-color);
  }

  > .divider {
    padding: 0 10px;
  }
}
</style>
