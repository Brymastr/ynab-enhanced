<template>
  <div class="h-screen">
    <!-- main -->
    <main class="h-full">
      <router-view class="h-full flex flex-col" v-if="budgetId"></router-view>
    </main>

    <!-- nav -->
    <Nav />
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import Nav from '@/components/Nav/Nav.vue';

export default defineComponent({
  components: { Nav },
  setup(props: any) {
    const budgetId = ref<string>();
    return { budgetId };
  },
});
</script>
