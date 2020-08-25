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
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import Nav from '@/components/Nav/Nav.vue';
const namespace = 'ynab';

@Component({
  components: { Nav },
})
export default class Main extends Vue {
  @State('selectedBudgetId', { namespace }) private budgetId!: string;
}
</script>
