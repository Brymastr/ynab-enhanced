<template>
  <div :class="{ negative: number < 0, positive: number >= 0 }">
    <Arrow v-if="arrow === true" :direction="number >= 0 ? 'up' : 'down'" />
    <div>{{ value }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
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
    });

    const result = formatter.format(Math.round(cur));

    return result.substring(0, result.length - 3);
  }
}
</script>

<style scoped lang="scss">
div {
  display: flex;
  align-items: center;
}

.positive {
  color: var(--positive-color);
}

.negative {
  color: var(--negative-color);
}
</style>
