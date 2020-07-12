<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <p>Home Page</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
const namespace = 'netWorth';

@Component
export default class Home extends Vue {
  @Action('getAccounts', { namespace }) private getAccounts: any;
  @Action('getMonthlyNetWorth', { namespace }) private getMonthlyNetWorth: any;

  mounted() {
    Promise.all([this.getAccounts(), this.getMonthlyNetWorth()]);
  }
}
</script>
