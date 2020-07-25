<template>
  <div class="container">
    <div class="budget-heading">
      <div>Budgets</div>
      <p>Select A Budget</p>
    </div>
    <div class="budget-names">
      <p v-for="budget in budgets" :key="budget.id">{{ budget.name }}</p>
      <p>Budget 1</p>
      <p>Budget 2</p>
      <p>Budget 3</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import { LoginStatus } from '../store/modules/user/types';
import { Budget } from '../store/modules/ynab/types';
const namespace = 'user';

@Component
export default class LoginBudgetSelect extends Vue {
  @Prop({ required: true }) private budgets: Budget[];
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: row;
}
</style>
