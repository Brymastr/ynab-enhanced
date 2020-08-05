<template>
  <div class="date-select" v-if="selectedStartDate && selectedEndDate">
    <div>Date Range</div>
    <select name="date-select-start" id="date-select-start" v-model="selectedStartDate">
      <option v-for="date in startDateOptions" :value="date" :key="date">{{
        date.substring(0, date.length - 3)
      }}</option>
    </select>
    <div>-</div>
    <select name="date-select-end" id="date-select-end" v-model="selectedEndDate">
      <option v-for="date in endDateOptions" :value="date" :key="date">{{
        date.substring(0, date.length - 3)
      }}</option>
    </select>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import moment from 'moment';
import { DateRange } from '../store/modules/ynab/types';
const namespace = 'ynab';

@Component
export default class DateSelect extends Vue {
  @Prop({ required: true })
  protected dates!: string[];

  @State('selectedBudgetId', { namespace })
  private budgetId!: string;

  @Action('setBudgetStartDate', { namespace })
  private setBudgetStartDate!: Function;

  @Action('setBudgetEndDate', { namespace })
  private setBudgetEndDate!: Function;

  @Getter('getSelectedStartDate', { namespace })
  private getSelectedStartDate!: Function;

  @Getter('getSelectedEndDate', { namespace })
  private getSelectedEndDate!: Function;

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

  @Watch('selectedStartDate')
  @Watch('selectedEndDate')
  private dateRangeSelected() {
    const budget = {
      selectedStartDate: this.selectedStartDate,
      selectedEndDate: this.selectedEndDate,
      id: this.budgetId,
    };
    this.setBudgetStartDate(budget);
    this.setBudgetEndDate(budget);
  }

  mounted() {
    this.selectedStartDate = this.getSelectedStartDate();
    this.selectedEndDate = this.getSelectedEndDate();
  }
}
</script>

<style scoped lang="scss">
.date-select {
  grid-area: date-select;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  min-width: 200px;

  div,
  select {
    font-size: 1.3em;
  }

  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    border: none;
    text-align: right;
    cursor: pointer;
    color: var(--font-color);
    font-family: Avenir, Helvetica, Arial, sans-serif;
    padding: 0 6px;
    transition: background-color 150ms;

    &:focus {
      outline: none;
    }

    &:hover {
      background-color: rgba(35, 118, 187, 0.315);
    }
  }

  div:first-child {
    font-size: 0.85em;
    flex-basis: 100%;
  }

  div:nth-child(3) {
    margin: 0 5px;
  }
}
</style>
