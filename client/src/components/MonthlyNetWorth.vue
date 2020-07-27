<template>
  <div class="monthly-net-worth">
    <div>
      <div v-for="[month, value] in Object.entries(chartData)" :key="month">
        {{ month }}: ${{ value / 1000 }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { WorthDate } from '../store/modules/ynab/types';
import { BLUE, GREY } from '../colors';

@Component
export default class MonthlyNetWorth extends Vue {
  @Prop({ required: true }) protected chartData!: WorthDate[];
}
</script>
