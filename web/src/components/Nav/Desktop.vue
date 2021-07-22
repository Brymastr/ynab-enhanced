<template>
  <div class="nav-parent xl:container mx-auto px-2 h-full hidden sm:grid">
    <!-- left side -->
    <div class="justify-start h-header flex" :class="{ invisible: hideLeftSide }">
      <NavItem @clicked="goToSettings" :selected="settingsSelected">Settings</NavItem>
      <NavItem @clicked="goToBudgets" :selected="budgetsSelected">Budgets</NavItem>
    </div>

    <!-- title -->
    <Title class="h-header" :class="{ invisible: hideTitle }" />

    <!-- right side -->
    <div class="justify-end h-header flex">
      <NavItem @clicked="logout" side="right">Logout</NavItem>
    </div>

    <!-- nav content -->
    <Expanded />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import useNav from '@/composables/nav';
import BudgetSelect from '@/components/Nav/BudgetSelect.vue';
import Settings from '@/components/Nav/Settings.vue';
import Expanded from '@/components/Nav/Expanded.vue';
import Title from '@/components/Nav/Title.vue';
import NavItem from '@/components/Nav/NavTopItem.vue';
import useYnab from '@/composables/ynab';

export default defineComponent({
  name: 'Desktop',
  components: { BudgetSelect, Settings, Title, NavItem, Expanded },
  setup() {
    const { navPage, goToSettings, goToBudgets, logout } = useNav();
    const { state: ynabState } = useYnab();
    const budgetId = computed(() => ynabState.selectedBudgetId);

    const hideTitle = computed(() => navPage.value !== null);
    const hideLeftSide = computed(() => !budgetId.value);
    const settingsSelected = computed(() => navPage.value === 'settings');
    const budgetsSelected = computed(() => navPage.value === 'budgets');

    return { hideTitle, hideLeftSide, settingsSelected, budgetsSelected, goToSettings, goToBudgets, logout };
  },
});
</script>

<style>
.nav-parent {
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: min-content auto min-content;
}
</style>
