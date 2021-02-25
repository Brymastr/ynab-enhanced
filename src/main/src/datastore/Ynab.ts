import Datastore, { QueryPrimaryKeys } from './Datastore';

export interface Tokens {
  AccessToken: string;
  RefreshToken: string;
  TokenType: string;
  Expiration: number;
}

export interface Schema extends Tokens, QueryPrimaryKeys {
  UserId: string;
}

export function isSchema(x: Record<string, any>): x is Schema {
  return (
    'AccessToken' in x &&
    'RefreshToken' in x &&
    'TokenType' in x &&
    'Expiration' in x &&
    'UserId' in x
  );
}

const RANGE_KEY = 'YNAB';

export default class Ynab extends Datastore {
  constructor() {
    super();
  }

  public async get(userId: string): Promise<Schema> {
    const query: QueryPrimaryKeys = { HashKey: userId, RangeKey: RANGE_KEY };

    const result = await super.getItem(query);

    if (!isSchema(result)) throw new Error('Query returned no results.');

    return result;
  }

  public async getByYnabUserId(userId: string): Promise<Schema> {
    const query = { UserId: userId, RangeKey: RANGE_KEY };

    const result = await super.getItem(query);

    if (!isSchema(result)) throw new Error('Query returned no results.');

    return result;
  }

  public async set(userId: string, tokens: Tokens) {
    const result = await super.setItem({ HashKey: userId, RangeKey: RANGE_KEY, ...tokens });

    return result;
  }
}
