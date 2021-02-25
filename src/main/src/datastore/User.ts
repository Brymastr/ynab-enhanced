import Datastore, { QueryPrimaryKeys } from './Datastore';
import { randomBytes } from 'crypto';
import { v4 as uuid } from 'uuid';

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

    if (!isSchema(result)) throw new Error('Query returned no results.');

    return result;
  }

  public async create() {
    const userId = uuid();
    const date = new Date();

    const result = await super.setItem({
      HashKey: userId,
      RangeKey: RANGE_KEY,
      DateCreated: date,
      LastLogin: date,
    });

    return userId;
  }
}
