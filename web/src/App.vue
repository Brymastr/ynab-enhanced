<template>
  <router-view />
</template>

<script lang="ts">
import locales from './locales';
locales();

import useShortcuts from '@/composables/shortcuts';
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    useShortcuts();
  },
});
</script>
