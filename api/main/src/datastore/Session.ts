import Datastore, { QueryPrimaryKeys } from './Datastore';
import { randomBytes } from 'crypto';
import { getUnixTime } from 'date-fns';

export interface Schema extends QueryPrimaryKeys {
  Token?: string;
  Expiration?: string;
}

export function isSchema(x: Record<string, any>): x is Schema {
  return true;
}

const RANGE_KEY = 'Session';

export default class Session extends Datastore {
  constructor() {
    super();
  }

  public async getUserBySession(sessionToken: string): Promise<Schema> {
    const query = { RangeKey: RANGE_KEY, Token: sessionToken };

    const result = await super.getItem(query);

    return isSchema(result) ? result : null;
  }

  public async upsert(schema: Schema) {
    const date = getUnixTime(new Date());

    let hashKey: string;

    // if(schema.Token)

    // const clone: Schema = {
    //   HashKey:
    // };

    const token = randomBytes(64).toString('hex');
    const expiration = date + 86400;

    const result = await super.setItem({
      HashKey: schema.HashKey,
      RangeKey: RANGE_KEY,
      Token: token,
      Expiration: expiration,
    });

    return { token, expiration };
  }
}
