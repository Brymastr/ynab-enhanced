import moment, { Moment } from 'moment';
import numeral from 'numeral';

export function formatDate(date: string | Moment) {
  return moment(date).format('MMM YYYY');
}

export function formatCurrency(number: number, full = false) {
  if (full || Math.abs(number) < 10000) return numeral(number).format('$0,00');
  else return numeral(number).format('$0a');
}
