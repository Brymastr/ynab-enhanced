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
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class NavTopItem extends Vue {
  @Prop({ required: false, default: false }) private selected!: boolean;
  @Prop({ required: true }) private click!: Function;
  @Prop({ required: false, default: 'left' }) private side!: 'left' | 'middle' | 'right';
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
