<template>
  <div>
    <LoginButton />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import LoginButton from '@/components/LoginButton.vue';
import router from '../router';

const userNS = 'user';
const ynabNS = 'ynab';

@Component({
  components: { LoginButton },
})
export default class Login extends Vue {
  @Action('login', { namespace: userNS }) private login!: Function;
  @Action('loadBudgets', { namespace: ynabNS }) private loadBudgets!: Function;

  mounted() {
    const sessionId = this.$route.query.session_id;

    if (typeof sessionId === 'string') this.loggedIn(sessionId);
  }

  private async loggedIn(sessionId: string | string[]) {
    if (typeof sessionId !== 'string') return;

    await this.loadBudgets();

    this.login(sessionId);

    setTimeout(() => router.push({ name: 'Main' }), 1000);
  }
}
</script>

<style scoped>
div {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary-color);
}
</style>
