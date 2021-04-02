<template>
  <div class="flex h-header items-center">
    <div class="mr-2">Date Range:</div>

    <!-- date select -->
    <div class="parent flex flex-col items-center text-xl leading-tight text-center">
      <!-- start date -->
      <select
        class="cursor-pointer bg-transparent font-thin h-full focus:outline-none"
        name="date-select-start"
        id="date-select-start"
        v-model="selectedStartDate"
        @change="dateRangeSelected"
      >
        <option class="bg-gray-800" v-for="date in startDateOptions" :value="date" :key="date">
          {{ formatDate(date) }}
        </option>
      </select>
      <div class="underline transition-all duration-200"></div>
    </div>

    <!-- divider -->
    <div class="mx-2 cursor-default">-</div>

    <!-- end date -->
    <div class="parent flex flex-col items-center text-xl leading-tight">
      <select
        class="cursor-pointer bg-transparent font-thin focus:outline-none"
        name="date-select-end"
        id="date-select-end"
        v-model="selectedEndDate"
        @change="dateRangeSelected"
      >
        <option class="bg-gray-800" v-for="date in endDateOptions" :value="date" :key="date">
          {{ formatDate(date) }}
        </option>
      </select>
      <div class="underline transition-all duration-200"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import moment from 'moment';
const namespace = 'ynab';

@Component
export default class DateSelect extends Vue {
  @Prop({ required: true }) dates!: string[];

  @State('selectedBudgetId', { namespace }) budgetId!: string;

  @Getter('getSelectedStartDate', { namespace }) getSelectedStartDate!: Function;
  @Getter('getSelectedEndDate', { namespace }) getSelectedEndDate!: Function;

  @Action('setBudgetStartDate', { namespace }) setBudgetStartDate!: Function;
  @Action('setBudgetEndDate', { namespace }) setBudgetEndDate!: Function;

  private selectedStartDate: string | null = null;
  private selectedEndDate: string | null = null;

  private get firstDate() {
    return this.dates[0];
  }

  private get lastDate() {
    return this.dates[this.dates.length - 1];
  }

  private get startDateOptions() {
    return this.dates.filter(date => {
      const current = moment(date);
      const start = moment(this.firstDate);
      const end = moment(this.selectedEndDate);
      return current.isBetween(start, end, undefined, '[)');
    });
  }

  private get endDateOptions() {
    return this.dates.filter(date => {
      const current = moment(date);
      const start = moment(this.selectedStartDate);
      const end = moment(this.lastDate);
      return current.isBetween(start, end, undefined, '(]');
    });
  }

  private formatDate(date: string) {
    return moment(date).format('MMM YYYY');
  }

  private dateRangeSelected() {
    const budget = {
      selectedStartDate: this.selectedStartDate,
      selectedEndDate: this.selectedEndDate,
      id: this.budgetId,
    };
    this.setBudgetStartDate(budget);
    this.setBudgetEndDate(budget);
  }

  private mounted() {
    this.setDates();
  }

  private updated() {
    this.setDates();
  }

  private setDates() {
    this.selectedStartDate = this.getSelectedStartDate();
    this.selectedEndDate = this.getSelectedEndDate();
  }
}
</script>

<style lang="scss" scoped>
select {
  -webkit-appearance: none;
  -moz-appearance: none;
}

.underline {
  width: 0;
  height: 2px;
  background-color: #41526b;
}

.parent:hover > .underline {
  width: 100%;
  color: white;
}

.parent > select {
  text-align-last: center;
}
</style>
