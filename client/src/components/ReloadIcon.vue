<template>
  <div :id="id" :class="{ rotate: rotateClass }" @click="action">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="icon icon-tabler icon-tabler-refresh"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -5v5h5" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 5v-5h-5" />
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';

@Component
export default class LoginBudgetSelect extends Vue {
  @Prop({ required: true }) private id: string;
  @Prop({ required: false }) private rotate: boolean;
  @Prop({ required: false }) private action: Function;

  private rotateClass = false;

  mounted() {
    const element = document.getElementById(this.id);
    element.addEventListener('animationiteration', this.listener, false);
  }

  listener(event) {
    this.rotateClass = this.rotate;
  }

  @Watch('rotate')
  rotateWatch(value: boolean) {
    if (value) this.rotateClass = true;
  }
}
</script>

<style scoped lang="scss">
svg {
  width: 100%;
  height: 100%;
}

@-moz-keyframes spin {
  from {
    -moz-transform: rotate(0deg);
  }
  to {
    -moz-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

div {
  cursor: pointer;
  transition: color 200ms ease-out;

  &:hover {
    color: white;
  }
}

.rotate {
  -ms-animation: spin 1000ms infinite cubic-bezier(0.54, 0.01, 0.44, 1);
  -moz-animation: spin 1000ms infinite cubic-bezier(0.54, 0.01, 0.44, 1);
  animation: spin 1000ms infinite cubic-bezier(0.54, 0.01, 0.44, 1);

  cursor: initial;

  &:hover {
    color: var(--font-color);
  }
}
</style>
