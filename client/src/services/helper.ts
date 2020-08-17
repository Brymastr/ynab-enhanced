import moment from 'moment';

export function formatDate(date: string) {
  return moment(date).format('YYYY-MM');
}

export function formatCurrency(number: number) {
  const formatter = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  });

  const result = formatter.format(number);

  return result.substring(0, result.length - 3);
}
