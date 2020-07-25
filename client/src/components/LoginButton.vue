<template>
  <div class="container">
    <button @click="ynabLogin" v-if="loginStatus === 'loggedOut'">Get Started</button>
    <div v-else>Pending</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import { LoginStatus } from '../store/modules/user/types';
const namespace = 'user';

@Component
export default class LoginButton extends Vue {
  @Action('ynabLogin', { namespace }) private ynabLogin: Function;
  @State('loginStatus', { namespace }) private loginStatus: LoginStatus;
}
</script>

<style scoped lang="scss">
.container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container > button {
  border-radius: 100%;
  display: block;
  cursor: pointer;
  height: 300px;
  width: 300px;
  background-color: white;
  transition: height 500ms ease, width 500ms ease;
  border: none;
  text-transform: uppercase;
  font-size: 2em;
  font-weight: bold;
  color: #5f87af;

  &:hover {
    height: 350px;
    width: 350px;
  }
}

.container > div {
  border-radius: 100%;
  height: 350px;
  width: 350px;
  background-color: white;
  border: none;
  text-transform: uppercase;
  font-size: 2em;
  font-weight: bold;
  color: #5f87af;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
