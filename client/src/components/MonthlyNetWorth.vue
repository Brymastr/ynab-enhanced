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
import { MonthlyNetWorth as MonthlyNetWorthType } from '../store/modules/netWorth/types';
const namespace = 'netWorth';

@Component
export default class MonthlyNetWorth extends Vue {
  @Prop({ required: true }) protected months!: MonthlyNetWorthType;
}
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
