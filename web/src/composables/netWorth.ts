import { getMonth } from 'date-fns';
import { WorthDate } from './types';

export function getDiffByMonth(netWorth: WorthDate[]) {
  const months: number[][] = Array.from(Array(12), () => []);

  for (const [, { date, worth, previous }] of netWorth.entries()) {
    const month = getMonth(new Date(date));
    const diff = worth - (previous?.worth ?? 0);

    months[month].push(diff);
  }

  // `months` is a 2d array with each higher order array referencing a month
  return months.map(month => Math.round(month.reduce((acc, cur) => acc + cur, 0) / month.length));
}
