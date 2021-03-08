import { format } from 'date-fns';
import numeral from 'numeral';

export function formatDate(date: string | Date) {
  return format(new Date(date), 'MMM yyyy');
}

export function formatCurrency(number: number, full = false) {
  if (full || Math.abs(number) < 10000) return numeral(number).format('$0,00');
  else return numeral(number).format('$0a');
}
