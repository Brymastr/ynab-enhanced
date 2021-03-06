import Datastore, { QueryPrimaryKeys } from './Datastore';
import { v4 as uuid } from 'uuid';
import { getUnixTime } from 'date-fns';

export interface Schema extends QueryPrimaryKeys {
  DateCreated: string;
  LastLogin: string;
}

export function isSchema(x: Record<string, any>): x is Schema {
  return true;
}

const RANGE_KEY = 'Info';

export default class User extends Datastore {
  constructor() {
    super();
  }

  public async get(userId: string): Promise<Schema> {
    const query = { HashKey: userId, RangeKey: RANGE_KEY };

    const result = await super.getItem(query);

    if (!isSchema(result)) return null;

    return result;
  }

  public async create() {
    const userId = uuid();
    const date = getUnixTime(new Date());

    const result = await super.setItem({
      HashKey: userId,
      RangeKey: RANGE_KEY,
      DateCreated: date,
      LastLogin: date,
    });

    return userId;
  }
}
