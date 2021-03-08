<template>
  <div class="flex flex-col items-center whitespace-no-wrap" v-if="monthlyNetWorth">
    <div class="text-xl">Net Change</div>
    <Currency class="text-3xl -mt-2" :number="value" />
  </div>
</template>

<script lang="ts">
import { WorthDate } from '@/composables/types';
import { PropType } from 'vue';
import { computed, defineComponent } from '@vue/runtime-core';
import Currency from '@/components/General/Currency.vue';

export default defineComponent({
  components: { Currency },
  props: {
    monthlyNetWorth: {
      type: Array as PropType<WorthDate[]>,
      required: true,
    },
  },
  setup(props: any) {
    const value = computed(() => {
      const first = props.monthlyNetWorth[0].worth;
      const last = props.monthlyNetWorth[props.monthlyNetWorth.length - 1].worth;

      return last - first;
    });

    return { value };
  },
});
</script>
