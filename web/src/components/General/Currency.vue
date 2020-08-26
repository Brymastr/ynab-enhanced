<template>
  <div
    :class="[
      { 'text-red-600': number < 0, 'text-blue-600': number >= 0 },
      'flex',
      'items-center',
      'whitespace-no-wrap',
    ]"
  >
    <Arrow class="-mx-1" v-if="arrow === true" :direction="number >= 0 ? 'up' : 'down'" />
    <div>{{ value }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { formatCurrency } from '../../services/helper';
import Arrow from '@/components/Icons/ArrowUpIcon.vue';

@Component({
  components: { Arrow },
})
export default class Currency extends Vue {
  @Prop({ required: true }) private number!: number;
  @Prop({ required: false, default: true }) private arrow!: boolean;
  @Prop({ required: false, default: false }) private full!: boolean;

  get value() {
    return formatCurrency(Math.abs(this.number), this.full);
  }
}
</script>
