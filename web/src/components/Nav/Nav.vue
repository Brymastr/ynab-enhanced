<template>
  <nav
    class="
      fixed
      top-0
      w-full
      transition-height
      duration-300
      ease-in-out
      bg-gray-800
      text-gray-300
      font-thin
      overflow-y-hidden
    "
    :class="navVisibility"
  >
    <DesktopNav />
    <MobileNav />
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import useNav from '@/composables/nav';
import useYnab from '@/composables/ynab';
import DesktopNav from '@/components/Nav/Desktop.vue';
import MobileNav from '@/components/Nav/Mobile.vue';

export default defineComponent({
  name: 'Nav',
  components: { DesktopNav, MobileNav },
  setup() {
    const { state: ynabState } = useYnab();
    const { firstUse, navVisibility } = useNav();

    const budgetId = computed(() => ynabState.selectedBudgetId);

    if (budgetId.value === null) firstUse();

    return {
      navVisibility,
    };
  },
});
</script>

<style lang="scss">
nav.open {
  height: 100%;
}

nav.mobile {
  height: 100px;
}

nav.closed {
  @apply h-header;
}
</style>
