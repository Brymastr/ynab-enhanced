<template>
  <div class="parent flex flex-col justify-center items-center cursor-pointer">
    <slot></slot>
    <div class="underline transition-all duration-200" :class="[{ selected }, `bg-${color}-400`]"></div>
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
      default: 'blue',
    },
  },
});
</script>

<style lang="scss" scoped>
.underline {
  width: 0;
  height: 2px;
}

.parent:hover > .underline,
.selected {
  width: 100%;
}
</style>
