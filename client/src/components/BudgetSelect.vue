<template>
  <div class="container">
    <div class="budgets-left">
      <div>Budgets</div>
      <p>Select a budget to analyze</p>
      <ReloadIcon
        class="reload"
        id="reload-budgets"
        :rotate="loadingBudgetsStatus === 'loading'"
        :action="loadBudgets"
        label="Refresh"
      />
      <ArrowRightCircleIcon v-if="selectedBudgetId" class="go" label="Go!" :action="done" />
    </div>
    <div class="vertical-line"></div>
    <div class="budgets-right">
      <div
        class="budget"
        v-for="budget in sortedBudgets"
        :key="budget.id"
        @click="budgetSelected(budget.id)"
      >
        <p>{{ budget.name }}</p>
        <CircleCheckIcon class="check" v-if="budget.id === selectedBudgetId" />
        <p>
          Time range: {{ formatDate(budget.first_month) }} - {{ formatDate(budget.last_month) }}
        </p>
        <p>Last updated: {{ dateDifFormat(budget.last_modified_on) }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import { LoginStatus } from '../store/modules/user/types';
import { Budget } from '../store/modules/ynab/types';
import moment from 'moment';
import ReloadIcon from '@/components/ReloadIcon.vue';
import CircleCheckIcon from '@/components/CircleCheckIcon.vue';
import ArrowRightCircleIcon from '@/components/ArrowRightCircleIcon.vue';
const namespace = 'ynab';

@Component({
  components: { ReloadIcon, CircleCheckIcon, ArrowRightCircleIcon },
})
export default class LoginBudgetSelect extends Vue {
  @State('budgets', { namespace }) private budgets!: Budget[];
  @State('loadingBudgetsStatus', { namespace }) private loadingBudgetsStatus!: Budget[];
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
    return moment(date).format('MMMM YYYY');
  }

  @Emit('done')
  done() {
    return;
  }
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

.budgets-left {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  > div:first-child {
    text-transform: uppercase;
    font-size: 4em;
  }

  > p {
    margin-right: 2px;
  }

  .reload,
  .go {
    font-size: 1em;
  }
}

.vertical-line {
  border-left: 1px solid var(--font-color);
  margin: 0 10px;
}

.budgets-right {
  text-align: left;

  .budget {
    cursor: pointer;
    transition: color 100ms ease-out;
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    > p:first-child {
      display: inline;
    }

    .check {
      padding-left: 10px;
      margin-bottom: -2px;
    }

    &:hover {
      color: white;
    }

    > p {
      padding-left: 20px;
    }

    > p:first-child {
      padding-left: 0;
      font-size: 2em;
    }
  }
}
</style>
