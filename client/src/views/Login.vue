<template>
  <div>
    <LoginButton />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import LoginButton from '@/components/LoginButton.vue';
const namespace = 'user';
const ynabNS = 'ynab';

@Component({
  components: { LoginButton },
})
export default class Login extends Vue {
  @Action('login', { namespace }) private login: any;
  @Action('getBudgets', { namespace: ynabNS }) private getBudgets: Function;

  private sessionId: string;

  mounted() {
    const sessionId = this.$route.query.session_id;

    if (sessionId) this.loggedIn(sessionId);
  }

  private async loggedIn(sessionId: string | string[]) {
    if (typeof sessionId !== 'string') return;

    this.sessionId = sessionId;

    await this.getBudgets();

    this.login(sessionId);
  }
}
</script>

<style scoped>
div {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #5f87af;
}
</style>
