import moment, { Moment } from 'moment';
import numeral from 'numeral';

export function formatDate(date: string | Moment) {
  return moment(date).format('YYYY-MM');
}

export function formatCurrency(number: number) {
  const formatter = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
  });

  if (Math.abs(number) >= 10000) return numeral(number).format('$0a');
  else return formatter.format(Math.round(number));
}
