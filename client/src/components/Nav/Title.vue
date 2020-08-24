<template>
  <div class="flex flex-col text-center justify-center text-2xl">
    <div>{{ budgetName }}</div>
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
