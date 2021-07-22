<template>
  <div
    class="parent flex flex-col justify-center items-center cursor-pointer"
    :class="{
      'first:ml-3': side === 'left',
      'last:mr-3': side === 'right',
    }"
    @click="click"
  >
    <Underline color="green" :selected="selected"><slot></slot></Underline>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/runtime-core';
import Underline from '@/components/General/Underline.vue';

export default defineComponent({
  name: 'Nav Top Item',
  components: { Underline },
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
