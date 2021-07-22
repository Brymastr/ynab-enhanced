<template>
  <div
    class="parent flex flex-col justify-center items-center cursor-pointer mr-3 -mb-1"
    :class="{
      'first:ml-3': side === 'left',
      'last:mr-3': side === 'right',
    }"
    @click="$emit('clicked')"
  >
    <Underline v-if="underline" color="green" :selected="selected"><slot></slot></Underline>
    <div v-else><slot></slot></div>
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
    underline: {
      type: Boolean,
      default: true,
    },
  },
});
</script>
