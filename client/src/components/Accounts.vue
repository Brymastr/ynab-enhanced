<template>
  <div class="accounts">
    <h1>Accounts</h1>
    <div v-for="account in accounts" :key="account.id">{{ account.name }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Account } from 'ynab';
const namespace = 'ynab';

@Component
export default class HelloWorld extends Vue {
  @State('accounts', { namespace }) private accounts!: Account[];
}
</script>

<style></style>
