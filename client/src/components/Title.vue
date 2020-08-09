<template>
  <div class="title">
    <div>{{ budgetName }}: Net Worth</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
const namespace = 'ynab';

@Component
export default class Title extends Vue {
  @State('selectedBudgetName', { namespace }) private budgetName!: string;
}
</script>

<style scoped lang="scss">
.title {
  grid-area: title;
  justify-self: center;
  font-size: 1.5em;
}
</style>
