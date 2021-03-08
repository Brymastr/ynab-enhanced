<template>
  <router-view />
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import locales from './locales';
locales();

export default class App extends Vue {}
</script>
