<template>
  <div class="h-screen">
    <LoginButton />
  </div>
</template>

<script lang="ts">
import LoginButton from '@/components/General/LoginButton.vue';
import { defineComponent, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  components: { LoginButton },
  setup() {
    const router = useRouter();
    const route = useRoute();

    function loggedIn(sessionToken: string, sessionExpiration: number) {
      console.log('loggedIn');
      console.log(sessionToken);
      console.log(sessionExpiration);

      setTimeout(() => router.push({ name: 'Net Worth' }), 1000);
    }

    onMounted(() => {
      const { sessionToken, sessionExpiration } = route.query;
      if (typeof sessionToken === 'string' && typeof sessionExpiration === 'string')
        loggedIn(sessionToken, parseInt(sessionExpiration));
    });
  },
});
</script>
