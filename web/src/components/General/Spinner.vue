<template>
  <div class="h-full text-gray-900 bg-gray-300 text-3xl flex flex-col justify-center" v-if="on">
    <ReloadIcon id="reload-icon" size="large" class="self-center cursor-wait" :rotate="true"
      ><slot></slot
    ></ReloadIcon>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ReloadIcon from '@/components/Icons/ReloadIcon.vue';
export default defineComponent({
  name: 'Loading Spinner',
  props: {
    on: Boolean,
  },
  components: {
    ReloadIcon,
  },
});
</script>
