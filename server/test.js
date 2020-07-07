const moment = require('moment');

const firstMonth = moment().subtract(10, 'months').date(0);
const lastMonth = moment().date(0);
const monthDifference = Math.floor(lastMonth.diff(firstMonth, 'months', true));
const accountMonths = [firstMonth.format('YYYY-MM-DD')];

for (let i = 1; i <= monthDifference; i++) {
  const currentMonth = firstMonth.add(1, 'months').date(0).format('YYYY-MM-DD');
  console.log(firstMonth);
  // accountMonths.push(currentMonth);
}
