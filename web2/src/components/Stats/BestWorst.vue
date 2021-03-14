<template>
  <div class="flex flex-col items-center whitespace-no-wrap" v-if="monthlyNetWorth">
    <div class="text-xl">Best and Worst</div>
    <div class="text-3xl -mt-2 flex flex-row">
      <Currency :number="best" />
      <div class="px-2">/</div>
      <Currency :number="worst" />
    </div>
  </div>
</template>

<script lang="ts">
import { WorthDate } from '@/composables/types';
import Currency from '@/components/General/Currency.vue';
import { defineComponent, PropType } from '@vue/runtime-core';
import { reactive, ref, computed } from 'vue';

export default defineComponent({
  components: { Currency },
  props: {
    monthlyNetWorth: {
      type: Array as PropType<WorthDate[]>,
      default: [],
    },
  },
  setup(props) {
    const diffs = () => {
      const amounts = props.monthlyNetWorth.map(({ worth }) => worth);
      if (amounts.length === 0) return [0];
      return amounts.map((amount, index) => {
        if (index === 0) return 0;
        else return amount - amounts[index - 1];
      });
    };

    const diffResult = ref(diffs());
    const best = computed(() => Math.max(...diffResult.value));
    const worst = computed(() => Math.min(...diffResult.value));

    return { best, worst };
  },
});
</script>
