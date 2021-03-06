import { marshall } from '@aws-sdk/util-dynamodb';
import { getUnixTime } from 'date-fns';

const date = getUnixTime(new Date());

const x: Record<string, any> = {
  HashKey: '21b28c9b-fac1-4cd1-99c0-ea7e0e9bd71d',
  RangeKey: 'Info',
  DateCreated: date,
  LastLogin: date,
};

const result = marshall(x);

console.log(result);
