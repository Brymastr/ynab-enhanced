<template>
  <div class="summary">
    <div>
      <div>Date</div>
      <div>{{ date }}</div>
    </div>
    <div>
      <div>Net Worth</div>
      <div>{{ worth }}</div>
    </div>
    <div>
      <div>Difference</div>
      <div v-if="difference">{{ difference }}</div>
      <div v-else>-</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CurrentNetWorthSummary extends Vue {
  @Prop({ required: true }) protected date!: string;
  @Prop({ required: true }) protected worth!: string;
  @Prop({ required: true }) protected difference!: string;
}
</script>

<style scoped lang="scss">
.summary {
  grid-area: summary;
  display: flex;
  flex-direction: row;

  > div {
    display: flex;
    flex-direction: column;

    div:first-child {
      font-size: 0.85em;
    }

    div:last-child {
      font-size: 1.3em;
      width: 8ch;
    }
  }
}
</style>
