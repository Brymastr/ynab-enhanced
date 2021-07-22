<template>
  <div class="flex justify-center items-center mx-auto col-span-3">
    <BudgetSelect v-if="navPage === 'budgets'" @done="goToBudgets" />
    <Settings v-else-if="navPage === 'settings'" @done="goToSettings" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useNav from '@/composables/nav';
import BudgetSelect from '@/components/Nav/BudgetSelect.vue';
import Settings from '@/components/Nav/Settings.vue';
import Title from '@/components/Nav/Title.vue';
import NavItem from '@/components/Nav/NavTopItem.vue';

export default defineComponent({
  name: 'Expanded',
  components: { BudgetSelect, Settings, Title, NavItem },
  setup() {
    const { navPage, goToSettings, goToBudgets } = useNav();

    return { navPage, goToSettings, goToBudgets };
  },
});
</script>

<style>
</style>
