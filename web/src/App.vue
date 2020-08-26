<template>
  <router-view />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import ShortcutsMixin from './mixins/Shortcuts';
import locales from './locales';
locales();

@Component
export default class Shortcuts extends mixins(ShortcutsMixin) {}
</script>
