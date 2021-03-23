// import { marshall } from '@aws-sdk/util-dynamodb';
// import { getUnixTime } from 'date-fns';

import { isBefore } from 'date-fns';

// const date = getUnixTime(new Date());

// const x: Record<string, any> = {
//   HashKey: '21b28c9b-fac1-4cd1-99c0-ea7e0e9bd71d',
//   RangeKey: 'Info',
//   DateCreated: date,
//   LastLogin: date,
// };

// const result = marshall(x);

// console.log(result);

const expiration = 1616438492400;

const now = new Date();

const result = isBefore(now, new Date(expiration));

console.log('now', now);
console.log('then', new Date(expiration));

console.log(result);
