<template>
  <div class="container" @click="action">
    <p class="label" v-if="label">{{ label }}</p>
    <div :id="id" :class="[{ rotate: rotateClass, ready: ready }, 'svg']">
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
        <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -5v5h5" />
        <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 5v-5h-5" />
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class LoginBudgetSelect extends Vue {
  @Prop({ required: true }) private id!: string;
  @Prop({ required: false }) private rotate!: boolean;
  @Prop({ required: false }) private label!: string;
  @Prop({ required: false }) private action!: Function;
  @Prop({ required: false }) private ready!: boolean;

  private rotateClass = false;

  mounted() {
    const element = document.getElementById(this.id);
    if (element) element.addEventListener('animationiteration', this.listener, false);
  }

  listener() {
    this.rotateClass = this.rotate;
  }

  @Watch('rotate')
  rotateWatch(value: boolean) {
    if (value) this.rotateClass = true;
  }
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

    > .svg.ready {
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

@-moz-keyframes spin {
  from {
    -moz-transform: rotate(-90deg);
  }
  to {
    -moz-transform: rotate(-360deg);
  }
}
@-webkit-keyframes spin {
  from {
    -webkit-transform: rotate(-90deg);
  }
  to {
    -webkit-transform: rotate(-360deg);
  }
}
@keyframes spin {
  from {
    transform: rotate(-90deg);
  }
  to {
    transform: rotate(-360deg);
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
