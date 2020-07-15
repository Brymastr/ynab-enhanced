<template>
  <div class="summary">
    <div>{{ date }}: {{ worth }}</div>
    <div v-if="difference">{{ difference }}</div>
    <div v-else>-</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { WorthDate } from '../store/modules/netWorth/types';

@Component
export default class CurrentNetWorthSummary extends Vue {
  @Prop({ required: true }) protected date!: string;
  @Prop({ required: true }) protected worth!: string;
  @Prop({ required: true }) protected difference!: string;
}
</script>

<style scoped>
.summary {
  grid-area: summary;
}
</style>
