import numeral from 'numeral';
import { isBefore, isSameDay, isAfter, format, getDaysInMonth } from 'date-fns';
import { formatToTimeZone } from 'date-fns-timezone';

export function formatDate(date: string | Date) {
  return format(new Date(date), 'MMM yyyy');
}

export function formatEndOfMonth(str?: string | null) {
  const date = new Date(str ?? '');
  const dateFormatted = formatToTimeZone(date, 'YYYY-MM-DD', {
    timeZone: 'UTC',
  });
  const days = getDaysInMonth(date);
  const end = `${dateFormatted.substring(0, 8)}${days}`;

  return end;
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
