<template>
  <div class="parent flex flex-col justify-center items-center cursor-pointer h-full">
    <slot></slot>
    <div class="underline transition-all duration-200" :class="[{ selected }, `bg-${color}-${level}`]"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Underline',
  props: {
    selected: Boolean,
    color: {
      type: String,
      default: 'gray',
    },
    level: {
      type: String,
      default: '800',
    },
  },
});
</script>

<style lang="postcss" scoped>
.underline {
  width: 0;
  height: 2px;
}

.parent:hover > .underline,
.selected {
  width: 100%;
}
</style>
