<template>
  <div class="monthly-net-worth">
    <h1>Monthly Net Worth</h1>
    <div>
      <div v-for="[month, value] in Object.entries(months)" :key="month">
        {{ month }}: ${{ value / 1000 }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import { MonthlyNetWorth } from '../store/modules/netWorth/types';
const namespace = 'netWorth';

@Component
export default class HelloWorld extends Vue {
  @State('months', { namespace }) private months: MonthlyNetWorth;

  computed;
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
