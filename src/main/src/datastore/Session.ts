import Datastore from './Datastore';
import { randomBytes } from 'crypto';

export interface Schema {
  Token: string;
  Expiration: string;
}

export function isSchema(x: Record<string, any>): x is Schema {
  return 'Token' in x && 'Expiration' in x;
}

const RANGE_KEY = 'Session';

export default class Session extends Datastore {
  constructor() {
    super();
  }

  public async getUserBySession(sessionToken: string): Promise<Schema> {
    const query = { RangeKey: RANGE_KEY, Token: sessionToken };

    const result = await super.getItem(query);

    if (!isSchema(result)) throw new Error('Query returned no results.');

    return result;
  }

  public async set(userId: string) {
    const token = randomBytes(64).toString('hex');
    const date = new Date();
    const expiration = date.setSeconds(date.getSeconds() + 86400);

    const result = await super.setItem({
      HashKey: userId,
      RangeKey: RANGE_KEY,
      Token: token,
      Expiration: expiration,
    });

    return { token, expiration };
  }
}
