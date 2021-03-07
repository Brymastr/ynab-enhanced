import Datastore, { QueryPrimaryKeys } from './Datastore';
import { v4 as uuid } from 'uuid';
import { getUnixTime } from 'date-fns';

export interface Schema extends QueryPrimaryKeys {
  DateCreated?: number;
  LastLogin?: number;
}

export function isSchema(x: Record<string, any>): x is Schema {
  return true;
}

const RANGE_KEY = 'Info';

export default class Info extends Datastore {
  constructor() {
    super();
  }

  public async get(userId: string): Promise<Schema> {
    const query = { HashKey: userId, RangeKey: RANGE_KEY };

    const result = await super.getItem(query);

    return isSchema(result) ? result : null;
  }

  public async upsert(schema: Schema) {
    const date = getUnixTime(new Date());

    const existing = await this.get(schema.HashKey);

    const clone: Schema = {
      HashKey: schema.HashKey,
      RangeKey: RANGE_KEY,
      LastLogin: date,
      DateCreated: existing.DateCreated ?? date,
    };

    const result = await super.setItem(clone);

    return isSchema(result) ? result : null;
  }
}
