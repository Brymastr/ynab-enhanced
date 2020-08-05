<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import ShortcutsMixin from './mixins/Shortcuts';

@Component
export default class Shortcuts extends mixins(ShortcutsMixin) {}
</script>

<style lang="scss">
body {
  padding: 0;
  margin: 0;
  height: 100vh;
  overflow-x: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;

  --font-color: #2c3e50;
  --primary-color: #5f87af;
  --positive-color: #5f87af;
  --negative-color: rgba(209, 102, 102);

  color: var(--font-color);
}

p {
  margin: 0;
}
</style>
