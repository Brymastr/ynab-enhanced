<template>
  <div class="flex items-stretch justify-end divide-x-2 divide-blue-400">
    <!-- left side -->
    <div class="flex flex-col items-end pr-5 mt-2">
      <div class="text-6xl uppercase leading-none">Budgets</div>
      <p>Select a budget to analyze</p>
      <ReloadIcon
        class="text-3xl -mr-2"
        id="reload-budgets"
        :rotate="rotate"
        :ready="ready"
        :action="loadBudgets"
        size="large"
        >{{ rotate || !ready ? 'Loading...' : 'Refresh' }}</ReloadIcon
      >

      <ArrowRightCircleIcon
        v-if="selectedBudgetId !== null"
        class="text-3xl -mr-2"
        label="Go!"
        :action="go"
        size="large"
      />
    </div>

    <!-- right side -->
    <div class="pl-1">
      <div
        class="cursor-pointer transition duration-100 ease-out hover:bg-gray-900 p-3"
        v-for="budget in sortedBudgets"
        :key="budget.id"
        @click="budgetSelected(budget)"
      >
        <span class="text-3xl leading-none">{{ budget.name }}</span>
        <CircleCheckIcon class="pl-2 -mt-2 inline-block" v-if="budget.id === selectedBudgetId" />
        <p class="pl-5">Beginning: {{ formatDate(budget.first_month) }}</p>
        <p class="pl-5">Last updated: {{ dateDifFormat(budget.last_modified_on) }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ReloadIcon from '@/components/Icons/ReloadIcon.vue';
import CircleCheckIcon from '@/components/Icons/CircleCheckIcon.vue';
import ArrowRightCircleIcon from '@/components/Icons/ArrowRightCircleIcon.vue';
import { formatDate } from '@/services/helper';
import { computed, defineComponent } from 'vue';
import useYnab from '@/composables/ynab';
import {
  differenceInHours,
  differenceInMinutes,
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
} from 'date-fns';

const TimeUnits = ['year', 'month', 'week', 'day', 'hour', 'minute'] as const;
type UnitOfTime = typeof TimeUnits[number];

export default defineComponent({
  name: 'Budget Select',
  components: { ReloadIcon, CircleCheckIcon, ArrowRightCircleIcon },
  setup(_, { emit }) {
    const { state, loadBudgets, budgetSelected, sortedBudgets } = useYnab();

    const now = new Date();

    function diffX(date: Date, unit: UnitOfTime) {
      let diff = 0;
      switch (unit) {
        case 'year':
          diff = differenceInYears(now, date);
          break;
        case 'month':
          diff = differenceInMonths(now, date);
          break;
        case 'week':
          diff = differenceInWeeks(now, date);
          break;
        case 'day':
          diff = differenceInDays(now, date);
          break;
        case 'hour':
          diff = differenceInHours(now, date);
          break;
        case 'minute':
          diff = differenceInMinutes(now, date);
          break;
      }
      return diff;
    }

    function dateDifFormat(date: string) {
      let message: string | null = null;

      for (const range of TimeUnits) {
        const diff = diffX(new Date(date), range);
        if (diff > 0) {
          const ps = diff === 1 ? range : range + 's';
          message = `${diff} ${ps} ago`;
          break;
        }
      }

      if (!message) message = 'Just now';

      return message;
    }

    if (state.budgets.length === 0) loadBudgets();

    const rotate = computed(() => state.loadingBudgetsStatus === 'loading');
    const ready = computed(() => state.loadingBudgetsStatus === 'ready');
    const selectedBudgetId = computed(() => state.selectedBudgetId);

    return {
      go: () => emit('done'),
      dateDifFormat,
      sortedBudgets,
      loadBudgets,
      budgetSelected,
      formatDate,
      selectedBudgetId,
      rotate,
      ready,
    };
  },
});
</script>
