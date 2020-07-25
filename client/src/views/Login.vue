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

@Component({
  components: { LoginButton },
})
export default class Login extends Vue {
  @Action('login', { namespace }) private login: any;

  mounted() {
    const sessionId = this.$route.query.session_id;

    if (sessionId) setTimeout(() => this.login(sessionId), 3000);
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
