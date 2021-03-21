<template>
  <div
    class="flex flex-col text-xl items-center bg-gray-200 shadow-lg rounded-sm whitespace-no-wrap"
    v-if="netWorth"
  >
    <div class="text-gray-200 bg-gray-800 p-2 rounded-t-sm w-full">Monthly</div>
    <div class="w-full divide-y divide-gray-400 overflow-y-scroll">
      <div
        class="flex flex-row justify-between px-2"
        :class="{ 'bg-gray-300': index % 2 === 1 }"
        v-for="(item, index) of rows"
        :key="item.date"
      >
        <div class="w-1/3">{{ item.date }}</div>
        <Currency class="w-1/3" :number="item.worth" :arrow="false" :full="true" />
        <Currency class="w-1/3" :number="item.previous" :arrow="item.previous !== 0" :full="true" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { WorthDate } from '@/composables/types';
import Currency from '@/components/General/Currency.vue';
import { defineComponent, PropType } from '@vue/runtime-core';
import { computed } from 'vue';
import { format } from 'date-fns';

interface Props {
  netWorth: WorthDate[];
}

export default defineComponent({
  name: 'Net Worth Table',
  components: { Currency },
  props: {
    netWorth: {
      type: Array as PropType<WorthDate[]>,
      default: [],
    },
  },
  setup(props: Props) {
    const rows = computed(() => {
      props.netWorth
        .map((item, index, list): any => {
          let previous = 0;
          if (index > 0) {
            previous = item.worth - list[index - 1].worth;
          }
          return Object.assign({}, item, {
            date: format(new Date(item.date), 'YYYY MMM'),
            previous,
          });
        })
        .reverse();
    });
  },
});
</script>
