<template>
  <div class="flex flex-col items-center whitespace-no-wrap" v-if="monthlyNetWorth">
    <div class="text-xl">Average Change</div>
    <Currency class="text-3xl -mt-2" :number="value" />
  </div>
</template>

<script lang="ts">
import { WorthDate } from '@/composables/types';
import Currency from '@/components/General/Currency.vue';
import { computed, defineComponent } from '@vue/runtime-core';
import { PropType } from 'vue';

export default defineComponent({
  props: {
    monthlyNetWorth: {
      type: Array as PropType<WorthDate[]>,
      required: true,
    },
  },
  components: {
    Currency,
  },
  setup(props: any) {
    const value = computed(() => {
      const first = props.monthlyNetWorth[0].worth;
      const last = props.monthlyNetWorth[props.monthlyNetWorth.length - 1].worth;

      const numMonths = props.monthlyNetWorth.length;
      return (last - first) / numMonths;
    });

    return { value };
  },
});
</script>
