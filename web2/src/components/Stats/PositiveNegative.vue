<template>
  <div class="flex flex-col items-center whitespace-no-wrap" v-if="monthlyNetWorth">
    <div class="text-xl">Positive and Negative</div>
    <div class="text-3xl -mt-2 flex flex-row">
      <div class="text-blue-600">+{{ positives }}</div>
      <div class="px-2">/</div>
      <div class="text-red-600">-{{ negatives }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { WorthDate } from '@/composables/types';
import { computed, defineComponent } from '@vue/runtime-core';
import { PropType, reactive } from 'vue';

export default defineComponent({
  props: {
    monthlyNetWorth: {
      type: Array as PropType<WorthDate[]>,
      required: true,
    },
  },
  setup(props) {
    const diffs = () => {
      return props.monthlyNetWorth.map(({ worth }, index, all) => {
        if (index === 0) return 0;
        return worth - all[index - 1].worth;
      });
    };

    const diffResult = reactive(diffs());
    const positives = computed(() => diffResult.reduce((acc, cur) => (cur >= 0 ? acc + 1 : acc)));
    const negatives = computed(() => diffResult.reduce((acc, cur) => (cur < 0 ? acc + 1 : acc)));

    return { positives, negatives };
  },
});
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  font-size: 1.2em;
}

.value {
  font-size: 1.8em;
  display: flex;
  justify-content: center;

  > .positives {
    color: var(--positive-color);
  }

  > .negatives {
    color: var(--negative-color);
  }

  > .divider {
    padding: 0 10px;
  }
}
</style>
