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
import { computed, defineComponent, PropType } from '@vue/runtime-core';
import { reactive } from 'vue';

export default defineComponent({
  components: { Currency },
  props: {
    monthlyNetWorth: {
      type: Array as PropType<WorthDate[]>,
      required: true,
    },
  },
  setup(props) {
    const diffs = () => {
      const amounts = props.monthlyNetWorth.map(({ worth }) => worth);
      return amounts.map((amount, index) => {
        if (index === 0) return 0;
        else return amount - amounts[index - 1];
      });
    };

    const diffResult = reactive(diffs());
    const best = computed(() => Math.max(...diffResult));
    const worst = computed(() => Math.min(...diffResult));

    return { best, worst };
  },
});
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
  display: flex;
  justify-content: center;

  > .divider {
    padding: 0 10px;
  }
}
</style>
