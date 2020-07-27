<template>
  <div class="container" @click="action">
    <p class="label" v-if="label">{{ label }}</p>
    <div class="svg">
      <svg
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
        <circle cx="12" cy="12" r="9" />
        <line x1="16" y1="12" x2="8" y2="12" />
        <line x1="16" y1="12" x2="12" y2="16" />
        <line x1="16" y1="12" x2="12" y2="8" />
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class LoginBudgetSelect extends Vue {
  @Prop({ required: false }) private label!: string;
  @Prop({ required: false }) private action!: Function;
}
</script>

<style scoped lang="scss">
.container {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  transition: color 200ms ease-out;

  &:hover {
    color: white;

    > .svg {
      transform: rotate(-90deg);
    }
  }

  > * {
    display: flex;
    align-items: center;
  }

  .label {
    font-size: 2em;
  }

  .svg {
    height: 70px;
    width: 70px;
    margin-right: -8px;
    transition: transform 200ms ease-out;

    > svg {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
