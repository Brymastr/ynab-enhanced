<template>
  <nav
    class="fixed top-0 h-header w-full transition-height duration-300 ease-in-out bg-gray-800 text-gray-300 font-thin"
    :class="{ visible: navPage !== null }"
  >
    <div class="xl:container mx-auto h-full">
      <!-- top left -->
      <div class="justify-start nav-top h-header" :class="{ invisible: !budgetId }">
        <NavItem :click="setNavPage.bind(this, 'settings')" :selected="navPage === 'settings'"
          >Settings</NavItem
        >
        <NavItem :click="setNavPage.bind(this, 'budgets')" :selected="navPage === 'budgets'"
          >Budgets</NavItem
        >
      </div>

      <!-- title -->
      <Title class="nav-top h-header" :class="{ invisible: navPage !== null }" />

      <!-- top right -->
      <div class="justify-end nav-top h-header">
        <NavItem :click="logout" side="right">Logout</NavItem>
      </div>

      <!-- nav content -->
      <div class="content mx-auto col-span-3">
        <BudgetSelect v-if="navPage === 'budgets'" v-on:done="setNavPage('budgets')" />
        <Settings v-else-if="navPage === 'settings'" v-on:done="setNavPage('settings')" />
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import BudgetSelect from '@/components/Nav/BudgetSelect.vue';
import Settings from '@/components/Nav/Settings.vue';
import Title from '@/components/Nav/Title.vue';
import NavItem from '@/components/Nav/NavTopItem.vue';
import { computed, defineComponent, nextTick, ref } from 'vue';
import useYnab from '@/composables/ynab';
import useSession from '@/composables/session';
import router from '@/router';

type NavPage = 'budgets' | 'settings' | null;

export default defineComponent({
  name: 'Nav',
  components: { BudgetSelect, Settings, Title, NavItem },
  setup() {
    const navPage = ref<NavPage>(null);
    const { state, clearState: clearYnabState } = useYnab();
    const { clearState: clearSessionState } = useSession();

    const budgetId = computed(() => state.selectedBudgetId);

    if (state.selectedBudgetId === null) navPage.value = 'budgets';

    function setNavPage(page: NavPage) {
      if (navPage.value === page) navPage.value = null;
      else navPage.value = page;
    }

    function logout() {
      clearYnabState();
      clearSessionState();
      nextTick(() => router.replace({ name: 'Landing' }));
    }

    return {
      navPage,
      setNavPage,
      budgetId,
      logout,
    };
  },
});
</script>

<style lang="scss">
nav > div:first-child {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: min-content auto min-content;
}

nav.visible {
  height: 100%;
}

nav .nav-top {
  display: flex;
  align-items: stretch;
  white-space: nowrap;
}

nav .content {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
