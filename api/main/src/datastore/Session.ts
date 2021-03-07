import Datastore, { QueryPrimaryKeys } from './Datastore';
import { randomBytes } from 'crypto';
import { getUnixTime } from 'date-fns';

export interface Schema extends QueryPrimaryKeys {
  SessionToken?: string;
  Expiration?: number;
  SessionStart?: number;
}

export function isSchema(x: Record<string, any>): x is Schema {
  return 'HashKey' in x;
}

const RANGE_KEY = 'Session';
const SESSION_DURATION_SECONDS = 86400;

export default class Session extends Datastore {
  constructor() {
    super();
  }

  private async renew(userId: string): Promise<Schema> {
    const Expiration = getUnixTime(new Date()) + SESSION_DURATION_SECONDS;
    const result = await super.setItem({ HashKey: userId, RangeKey: RANGE_KEY, Expiration });
    return isSchema(result) ? result : null;
  }

  public async getUserBySession(sessionToken: string): Promise<Schema> {
    const query = { RangeKey: RANGE_KEY, SessionToken: sessionToken };

    const result = await super.getItem(query, 'SessionIndex');

    return result;
  }

  public async getSessionByUser(userId: string) {
    const result = await super.getItem({ HashKey: userId, RangeKey: RANGE_KEY });

    return isSchema(result) ? result : null;
  }

  public async upsert(schema: Schema): Promise<Schema> {
    const date = getUnixTime(new Date());

    let result: { [key: string]: any };

    const existing = await this.getSessionByUser(schema.HashKey);
    if (existing && existing.Expiration > date) {
      result = await this.renew(schema.HashKey);
    } else {
      const token = randomBytes(64).toString('hex');
      const expiration = date + SESSION_DURATION_SECONDS;

      result = await super.setItem({
        HashKey: schema.HashKey,
        RangeKey: RANGE_KEY,
        SessionToken: token,
        Expiration: expiration,
        SessionStart: date,
      });
    }

    console.log(existing && existing.Expiration > date);
    console.log(result);

    return isSchema(result) ? result : null;
  }
}
