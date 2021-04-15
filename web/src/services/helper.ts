import numeral from 'numeral';
import { isBefore, isSameDay, isAfter, format } from 'date-fns';

export function formatDate(date: string | Date) {
  return format(new Date(date), 'MMM yyyy');
}

export function formatCurrency(number: number | string, full = false) {
  if (typeof number === 'string') number = parseFloat(number);
  if (full || Math.abs(number) < 10000) return numeral(number).format('$0,00');
  else return numeral(number).format('$0a');
}

export function isBetween(test: Date, start: Date, end: Date) {
  const beforeEnd = isBefore(test, end);
  const afterStart = isAfter(test, start);
  const sameDay = isSameDay(test, start) || isSameDay(test, end);
  return (beforeEnd && afterStart) || sameDay;
}
