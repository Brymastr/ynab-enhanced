<template>
  <div class="h-screen">
    <LoginButton />
  </div>
</template>

<script lang="ts">
import LoginButton from '@/components/General/LoginButton.vue';
import { defineComponent, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  components: { LoginButton },
  setup() {
    const router = useRouter();
    const route = useRoute();

    onMounted(() => {
      const { sessionToken, sessionExpiration } = route.query;

      async function loggedIn(sessionToken: string, sessionExpiration: number) {
        // this.login({ token: sessionToken, expiration: sessionExpiration });

        // await this.loadBudgets();

        // arbitrary 1 second delay to give the impression of things working
        setTimeout(() => router.push({ name: 'Net Worth' }), 1000);
      }

      if (typeof sessionToken === 'string' && typeof sessionExpiration === 'string')
        loggedIn(sessionToken, parseInt(sessionExpiration));
    });
  },
});
</script>
