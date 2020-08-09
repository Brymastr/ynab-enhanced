<template>
  <div class="container" v-if="monthlyNetWorth">
    <div class="title">Positive v. Negative Months</div>
    <div class="value">
      <div class="positives">+{{ positives }}</div>
      <div class="divider">/</div>
      <div class="negatives">-{{ negatives }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { WorthDate } from '../store/modules/ynab/types';

@Component
export default class AverageChange extends Vue {
  @Prop({ required: true }) protected monthlyNetWorth!: WorthDate[];

  get positives() {
    return this.monthlyNetWorth
      .map(({ worth }) => worth)
      .reduce((acc, cur) => {
        if (cur >= 0) return acc + 1;
        else return acc;
      }, 0);
  }

  get negatives() {
    return this.monthlyNetWorth
      .map(({ worth }) => worth)
      .reduce((acc, cur) => {
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
