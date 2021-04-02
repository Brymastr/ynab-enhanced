<template>
  <div class="parent flex flex-col justify-center items-center cursor-pointer px-2">
    <slot></slot>
    <div class="underline transition-all duration-200" :class="[{ selected }, `bg-${color}`]"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class NavTopItem extends Vue {
  @Prop({ required: false, default: false }) private selected!: boolean;
  @Prop({ required: false, default: 'blue-400' }) private color!: string;
}
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
