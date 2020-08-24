<template>
  <div
    class="login-button-container rounded-full"
    :class="[
      {
        'cursor-pointer': buttonState !== 'up',
      },
    ]"
    @mousedown="mouseDownEvent"
    @mouseup="mouseUpEvent"
    @mouseenter="mouseEnterEvent"
    @mouseleave="mouseLeaveEvent"
  >
    <div
      class="login-button-background rounded-full bg-blue-400 w-40 h-40"
      :class="[
        {
          ready: buttonState === 'ready',
          hover: buttonState === 'hover',
          down: buttonState === 'down',
          up: buttonState === 'up' || loginStatus === 'loggedIn',
        },
      ]"
    ></div>
    <div
      class="login-button-text text-white text-2xl uppercase whitespace-no-wrap"
      :class="[
        {
          'cursor-pointer': buttonState !== 'up',
          'cursor-default': buttonState === 'up',
        },
      ]"
    >
      {{ message }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import { LoginStatus } from '../../store/modules/user/types';
const namespace = 'user';

@Component
export default class LoginButton extends Vue {
  @Action('ynabLogin', { namespace }) private ynabLogin!: Function;
  @State('loginStatus', { namespace }) private loginStatus!: LoginStatus;

  private buttonState: 'ready' | 'hover' | 'down' | 'up' = 'ready';

  mouseDownEvent() {
    if (this.buttonState !== 'up') {
      this.buttonState = 'down';
    }
  }
  mouseUpEvent() {
    if (this.buttonState !== 'up') {
      this.buttonState = 'up';
    }

    setTimeout(() => {
      this.ynabLogin();
    }, 500);
  }
  mouseEnterEvent() {
    if (this.buttonState !== 'up') {
      this.buttonState = 'hover';
    }
  }
  mouseLeaveEvent() {
    if (this.buttonState !== 'up') {
      this.buttonState = 'ready';
    }
  }

  private get message() {
    if (this.loginStatus === 'loggedOut') return 'Get Started';
    else if (this.loginStatus === 'loggedIn') return 'Success!';
    else if (this.buttonState === 'up') return 'Logging in';
    else return 'Logging in';
  }
}
</script>

<style lang="postcss" scoped>
.login-button-background {
  transition-property: height width;
  transition-duration: 300ms;
  transition-timing-function: ease-in-out;
}

.login-button-background.ready {
  height: 180px;
  width: 180px;
}

.login-button-background.hover {
  height: 300px;
  width: 300px;
}

.login-button-background.down {
  height: 250px;
  width: 250px;
}

.login-button-background.up {
  height: 100vh;
  width: 100vw;
  border-radius: 0%;
}

.login-button-text {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
