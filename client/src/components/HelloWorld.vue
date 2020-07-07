<template>
  <div class="hello">
    hello
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import { MonthlyNetWorth } from '../store/modules/netWorth/types';
const namespace = 'netWorth';

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;
  @Action('getMonthlyNetWorth', { namespace }) getMonthlyNetWorth: any;
  @Action('getAccounts', { namespace }) getAccounts: any;

  async mounted() {
    // const response = await this.getMonthlyNetWorth();
    const response = await this.getAccounts();
  }
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
