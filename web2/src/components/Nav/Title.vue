<template>
  <div class="flex flex-col text-center justify-center text-2xl">
    <div>{{ budgetName }}</div>
  </div>
</template>

<script lang="ts">
import useYnab from '@/composables/ynab';
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  name: 'Nav Title',
  setup() {
    const { state } = useYnab();
    return { budgetName: state.selectedBudgetName };
  },
});
</script>
