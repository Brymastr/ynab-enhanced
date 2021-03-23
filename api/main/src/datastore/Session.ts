import Datastore, { QueryPrimaryKeys } from './Datastore';
import { randomBytes } from 'crypto';
import { addSeconds, getUnixTime, isBefore } from 'date-fns';

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
    const Expiration = +addSeconds(new Date(), SESSION_DURATION_SECONDS);
    const result = await super.setItem({ HashKey: userId, RangeKey: RANGE_KEY, Expiration });
    return isSchema(result) ? result : null;
  }

  public async verify(sessionToken: string) {
    const query = { RangeKey: RANGE_KEY, SessionToken: sessionToken };
    const result = (await super.getItem(query, 'SessionIndex')) as Schema;
    console.dir(result);

    if (!result) return false;

    const now = new Date();
    return isBefore(now, new Date(result.Expiration));
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
    const date = Date.now();

    let result: { [key: string]: any };

    const existing = await this.getSessionByUser(schema.HashKey);
    if (existing && existing.Expiration > date) {
      result = await this.renew(schema.HashKey);
    } else {
      const token = randomBytes(32).toString('hex');
      const expiration = addSeconds(date, SESSION_DURATION_SECONDS);
      const payload: Schema = {
        HashKey: schema.HashKey,
        RangeKey: RANGE_KEY,
        SessionToken: token,
        Expiration: +expiration,
        SessionStart: date,
      };
      result = await super.setItem(payload);
    }

    return isSchema(result) ? result : null;
  }
}
