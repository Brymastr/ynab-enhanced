<template>
  <div
    class="parent flex flex-col justify-center items-center cursor-pointer px-2"
    :class="{
      'first:ml-3': side === 'left',
      'last:mr-3': side === 'right',
    }"
    @click="click"
  >
    <slot></slot>
    <div class="underline bg-blue-400 transition-all duration-200" :class="[{ selected }]"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/runtime-core';

export default defineComponent({
  name: 'Nav Top Item',
  props: {
    selected: {
      type: Boolean,
      default: false,
    },
    click: Function,
    side: {
      type: String as PropType<'left' | 'middle' | 'right'>,
      default: 'left',
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
  color: white;
}
</style>
