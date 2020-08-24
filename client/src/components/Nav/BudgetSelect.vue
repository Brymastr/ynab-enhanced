<template>
  <div class="flex items-stretch justify-end divide-x divide-blue-400">
    <!-- left side -->
    <div class="flex flex-col items-end pr-5 mt-2">
      <div class="text-6xl uppercase leading-none">Budgets</div>
      <p>Select a budget to analyze</p>
      <ReloadIcon
        class="w-auto"
        id="reload-budgets"
        :rotate="loadingBudgetsStatus === 'loading'"
        :ready="loadingBudgetsStatus === 'ready'"
        :action="loadBudgets"
        label="Refresh"
      />
      <ArrowRightCircleIcon v-if="selectedBudgetId" class="w-auto" label="Go!" :action="done" />
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
import { Component, Vue, Emit } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import { Budget } from '../../store/modules/ynab/types';
import moment from 'moment';
import ReloadIcon from '@/components/Icons/ReloadIcon.vue';
import CircleCheckIcon from '@/components/Icons/CircleCheckIcon.vue';
import ArrowRightCircleIcon from '@/components/Icons/ArrowRightCircleIcon.vue';
const namespace = 'ynab';

@Component({
  components: { ReloadIcon, CircleCheckIcon, ArrowRightCircleIcon },
})
export default class LoginBudgetSelect extends Vue {
  @State('budgets', { namespace }) private budgets!: Budget[];
  @State('loadingBudgetsStatus', { namespace }) private loadingBudgetsStatus!: string;
  @State('selectedBudgetId', { namespace }) private selectedBudgetId!: string;
  @Action('loadBudgets', { namespace }) private loadBudgets!: Function;
  @Action('budgetSelected', { namespace }) private budgetSelected!: Function;

  private now = moment();

  private get sortedBudgets() {
    return this.budgets.sort(this.sort);
  }

  private sort(a: Budget, b: Budget) {
    const aDate = moment(a.last_modified_on);
    const bDate = moment(b.last_modified_on);

    if (aDate.isAfter(bDate)) return -1;
    else return 1;
  }

  dateDifFormat(date: string) {
    const m = moment(date);

    const ranges: moment.unitOfTime.Diff[] = ['year', 'month', 'week', 'day', 'hour', 'minute'];

    let message: string | null = null;

    for (const range of ranges) {
      const diff = this.now.diff(m, range);
      if (diff > 0) {
        const ps = diff === 1 ? range : range + 's';
        message = `${diff} ${ps} ago`;
        break;
      }
    }

    if (!message) message = 'Just now';

    return message;
  }

  formatDate(date: string) {
    return moment(date).format('MMM YYYY');
  }

  @Emit('done')
  done() {
    return;
  }
}
</script>
