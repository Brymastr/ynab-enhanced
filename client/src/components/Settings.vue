<template>
  <div class="container">
    <p>Settings</p>
    <p>Setting 1</p>
    <p>Setting 2</p>
    <p>Setting 3</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import { LoginStatus } from '../store/modules/user/types';
const namespace = 'user';

@Component
export default class LoginBudgetSelect extends Vue {}
</script>

<style scoped lang="scss">
.container {
  grid-area: content;
}
</style>
