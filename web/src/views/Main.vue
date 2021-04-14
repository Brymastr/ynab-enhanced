<template>
  <div class="h-screen">
    <!-- main -->
    <main class="h-full">
      <router-view class="h-full flex flex-col" v-if="selectedBudgetId"></router-view>
    </main>

    <!-- nav -->
    <Nav />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Nav from '@/components/Nav/Nav.vue';
import useYnab from '@/composables/ynab';

export default defineComponent({
  components: { Nav },
  setup() {
    const { selectedBudgetId } = useYnab();
    return { selectedBudgetId };
  },
});
</script>
