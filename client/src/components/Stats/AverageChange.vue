<template>
  <div class="container" v-if="monthlyNetWorth">
    <div class="title">Average Change</div>
    <Currency class="value" :number="value" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { WorthDate } from '../../store/modules/ynab/types';
import Currency from '@/components/General/Currency.vue';

@Component({
  components: { Currency },
})
export default class AverageChange extends Vue {
  @Prop({ required: true }) protected monthlyNetWorth!: WorthDate[];

  get value() {
    const first = this.monthlyNetWorth[0].worth;
    const last = this.monthlyNetWorth[this.monthlyNetWorth.length - 1].worth;

    const numMonths = this.monthlyNetWorth.length;

    return (last - first) / numMonths;
  }
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 1.2em;
}

.value {
  font-size: 1.8em;
  justify-content: center;
}
</style>
