<template>
  <div class="parent flex cursor-pointer items-center" @click="action">
    <p class="pr-1"><slot></slot></p>
    <svg
      :id="id"
      class="block transition-transform duration-200 ease-in-out h-full"
      :class="[
        { rotate: rotateClass, ready },
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
import { defineComponent, onMounted, watch } from 'vue';
import { ref } from 'vue';
export type ArrowDirection = 'up' | 'right' | 'down' | 'left';

interface Props {
  id: string;
  size: string;
  rotate: boolean;
  ready: boolean;
  action?: Function;
}

export default defineComponent({
  props: {
    id: { type: String, required: true },
    size: { type: String, default: 'auto' },
    rotate: Boolean,
    ready: Boolean,
    action: Function,
  },
  setup(props: Props) {
    const rotateClass = ref<boolean>(props.rotate);

    function listener() {
      rotateClass.value = props.rotate;
    }

    watch(
      () => props.rotate,
      n => {
        if (n) rotateClass.value = true;
      },
    );

    onMounted(() => {
      const element = document.getElementById(props.id);
      if (element) element.addEventListener('animationiteration', listener, false);
    });

    return {
      rotateClass,
    };
  },
});
</script>

<style  lang="scss">
.parent:hover .ready {
  transform: rotate(-90deg);
}

@keyframes startSpin {
  0% {
    transform: rotate(-90deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}

@keyframes spin4 {
  from {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}

.rotate {
  animation: startSpin 1.05s cubic-bezier(0.54, 0.01, 0.44, 1) 1,
    spin4 1.05s cubic-bezier(0.54, 0.01, 0.44, 1) 1s infinite;
}
</style>
