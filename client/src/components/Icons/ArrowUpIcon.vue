<template>
  <svg
    :class="[
      'transform',
      {
        'rotate-90': direction === 'right',
        'rotate-180': direction === 'down',
        '-rotate-90': direction === 'left',
      },
    ]"
    class="inline-block h-8 w-8"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    stroke-width="1.8"
    stroke="currentColor"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
    xml:space="preserve"
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="18" y1="11" x2="12" y2="5" />
    <line x1="6" y1="11" x2="12" y2="5" />
  </svg>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class LoginBudgetSelect extends Vue {
  @Prop({ required: false, default: 'up' }) private direction!: 'up' | 'right' | 'down' | 'left';
}
</script>
