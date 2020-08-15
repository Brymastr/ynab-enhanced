<template>
  <div class="container">
    <svg
      :class="direction"
      class="svg"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="1.8"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="18" y1="11" x2="12" y2="5" />
      <line x1="6" y1="11" x2="12" y2="5" />
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class LoginBudgetSelect extends Vue {
  @Prop({ required: false, default: 'up' }) private direction!: 'up' | 'right' | 'down' | 'left';
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: row;
  align-items: stretch;

  > * {
    display: flex;
    align-items: center;
  }

  .svg {
    height: 30px;
    width: 30px;
    // padding: 5px;
    margin-right: -3px;
    margin-left: -8px;
    margin-top: -2px;

    > svg {
      width: 100%;
      height: 100%;
    }
  }
}

.up {
  color: var(--positive-color);
}

.right {
  transform: rotate(90deg);
}

.down {
  color: var(--negative-color);
  transform: rotate(180deg);
}

.left {
  transform: rotate(270deg);
}
</style>
