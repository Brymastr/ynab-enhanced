<template>
  <div class="h-screen">
    <LoginButton />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import LoginButton from '@/components/General/LoginButton.vue';
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
    const { sessionToken, sessionExpiration } = this.$route.query;

    if (typeof sessionToken === 'string' && typeof sessionExpiration === 'string')
      this.loggedIn(sessionToken, parseInt(sessionExpiration));
  }

  private async loggedIn(sessionToken: string, sessionExpiration: number) {
    if (typeof sessionToken !== 'string') return;

    await this.loadBudgets();

    this.login({ token: sessionToken, expiration: sessionExpiration });

    setTimeout(() => router.push({ name: 'Net Worth' }), 1000);
  }
}
</script>
