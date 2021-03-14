<template>
  <div
    class="login-button-container rounded-full"
    :class="[
      {
        'cursor-pointer': buttonState !== 'up',
      },
    ]"
    @mousedown="mouseDownEvent"
    @touchstart="mouseDownEvent"
    @touchend="mouseUpEvent"
    @mouseup="mouseUpEvent"
    @mouseenter="mouseEnterEvent"
    @mouseleave="mouseLeaveEvent"
  >
    <div
      class="login-button-background rounded-full bg-gray-800 w-40 h-40"
      :class="[
        {
          ready: buttonState === 'ready',
          hover: buttonState === 'hover',
          down: buttonState === 'down',
          up: buttonState === 'up' || loginStatus === 'loggedIn',
          'transition-none': loginStatus === 'loggedIn',
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
import { computed, defineComponent } from 'vue';
import { ref } from 'vue';

type ButtonState = 'ready' | 'hover' | 'down' | 'up';
type LoginStatus = 'pending' | 'loggedIn' | 'loggedOut';

const buttonState: 'ready' | 'hover' | 'down' | 'up' = 'ready';

export default defineComponent({
  setup() {
    const buttonState = ref<ButtonState>('ready');
    const loginStatus = ref<LoginStatus>('loggedOut');

    function mouseDownEvent() {
      if (buttonState.value !== 'up') {
        buttonState.value = 'down';
      }
    }

    function mouseUpEvent() {
      if (buttonState.value !== 'up') {
        buttonState.value = 'up';
      }

      console.log('mouseUpEvent');

      // setTimeout(() => {
      //   this.ynabLogin();
      // }, 500);
    }

    function mouseEnterEvent() {
      if (buttonState.value !== 'up') {
        buttonState.value = 'hover';
      }
    }
    function mouseLeaveEvent() {
      if (buttonState.value !== 'up') {
        buttonState.value = 'ready';
      }
    }

    const message = computed(() => {
      if (loginStatus.value === 'loggedOut') return 'Get Started';
      else if (loginStatus.value === 'loggedIn') return 'Success!';
      else if (buttonState.value === 'up') return 'Logging in';
      else return 'Logging in';
    });

    return {
      mouseDownEvent,
      mouseUpEvent,
      mouseEnterEvent,
      mouseLeaveEvent,
      message,
      loginStatus,
      buttonState,
    };
  },
});
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
  height: 100vmax;
  width: 100vmax;
  border-radius: 0%;
}

.login-button-text,
.login-button-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  touch-action: none;
  user-select: none;
}

@media (pointer: coarse) {
  .login-button-background.ready {
    height: 250px;
    width: 250px;
  }

  .login-button-background.down {
    height: 200px;
    width: 200px;
  }

  .login-button-container {
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
}
</style>
