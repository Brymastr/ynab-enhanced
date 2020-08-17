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
import { WorthDate } from '../../store/modules/ynab/types';
import { formatDate, formatCurrency } from '../../services/helper';

@Component
export default class CurrentNetWorthSummary extends Vue {
  @Prop({ required: true }) protected worthDate!: WorthDate;

  private get difference() {
    if (this.worthDate.previous !== undefined) {
      return formatCurrency(this.worthDate.worth - this.worthDate.previous.worth);
    } else return null;
  }

  private get date() {
    return formatDate(this.worthDate.date);
  }

  private get worth() {
    return formatCurrency(this.worthDate.worth);
  }
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
