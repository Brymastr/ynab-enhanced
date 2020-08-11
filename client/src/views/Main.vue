<template>
  <div>
    <div class="header-fix"></div>
    <main>
      <router-view v-if="budgetId"></router-view>
    </main>
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

<style scoped lang="scss">
#app > div {
  --header-height: 54px;

  margin: 0;

  > .header-fix {
    height: var(--header-height);
  }
}
</style>
