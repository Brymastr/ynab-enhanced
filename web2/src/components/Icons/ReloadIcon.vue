<template>
  <div class="parent flex cursor-pointer items-center" @click="action">
    <p class="pr-1" v-if="label">{{ label }}</p>
    <svg
      :id="id"
      class="block transition-transform duration-200 ease-in-out h-full"
      :class="[
        { rotate, ready },
        { 'w-8': size === 'small', 'w-16': size === 'large', 'w-auto': size === 'auto' },
      ]"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="1"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -5v5h5" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 5v-5h-5" />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch } from '@vue/runtime-core';
import { ref } from 'vue';
export type ArrowDirection = 'up' | 'right' | 'down' | 'left';

interface Props {
  id: string;
  size: string;
  rotate: boolean;
  label: string;
  action: Function;
  ready: boolean;
}

export default defineComponent({
  props: {
    id: { type: String, required: true },
    size: { type: String, default: 'auto' },
    rotate: Boolean,
    label: String,
    action: Function,
    ready: Boolean,
  },
});
</script>

<style scoped lang="scss">
.parent:hover .ready {
  transform: rotate(-90deg);
}

@-moz-keyframes spin {
  from {
    -moz-transform: rotate(-90deg);
  }
  to {
    -moz-transform: rotate(-360deg);
  }
}
@-webkit-keyframes spin {
  from {
    -webkit-transform: rotate(-90deg);
  }
  to {
    -webkit-transform: rotate(-360deg);
  }
}
@keyframes spin {
  from {
    transform: rotate(-90deg);
  }
  to {
    transform: rotate(-360deg);
  }
}

.rotate {
  -ms-animation: spin 1000ms infinite cubic-bezier(0.54, 0.01, 0.44, 1);
  -moz-animation: spin 1000ms infinite cubic-bezier(0.54, 0.01, 0.44, 1);
  animation: spin 1000ms infinite cubic-bezier(0.54, 0.01, 0.44, 1);

  cursor: initial;
}
</style>
