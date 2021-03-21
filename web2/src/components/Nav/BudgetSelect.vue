<template>
  <div class="flex items-stretch justify-end divide-x-2 divide-blue-400">
    <!-- left side -->
    <div class="flex flex-col items-end pr-5 mt-2">
      <div class="text-6xl uppercase leading-none">Budgets</div>
      <p>Select a budget to analyze</p>
      <ReloadIcon
        class="text-3xl -mr-2"
        id="reload-budgets"
        :rotate="loadingBudgetsStatus === 'loading'"
        :ready="loadingBudgetsStatus === 'ready'"
        :action="loadBudgets"
        label="Refresh"
        size="large"
      />
      <ArrowRightCircleIcon
        v-if="selectedBudgetId"
        class="text-3xl -mr-2"
        label="Go!"
        :action="done"
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
        <p class="pl-5">
          Time range: {{ formatDate(budget.first_month) }} - {{ formatDate(budget.last_month) }}
        </p>
        <p class="pl-5">Last updated: {{ dateDifFormat(budget.last_modified_on) }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ReloadIcon from '@/components/Icons/ReloadIcon.vue';
import CircleCheckIcon from '@/components/Icons/CircleCheckIcon.vue';
import ArrowRightCircleIcon from '@/components/Icons/ArrowRightCircleIcon.vue';
import { defineComponent } from 'vue';
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
  setup() {
    const { state, loadBudgets, budgetSelected, sortedBudgets } = useYnab();

    const now = new Date();

    function diffX(date: Date, unit: UnitOfTime) {
      let diff = 0;
      switch (unit) {
        case 'year':
          diff = differenceInYears(date, now);
          break;
        case 'month':
          diff = differenceInMonths(date, now);
          break;
        case 'week':
          diff = differenceInWeeks(date, now);
          break;
        case 'day':
          diff = differenceInDays(date, now);
          break;
        case 'hour':
          diff = differenceInHours(date, now);
          break;
        case 'minute':
          diff = differenceInMinutes(date, now);
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

    return { dateDifFormat, sortedBudgets };
  },
});
</script>
