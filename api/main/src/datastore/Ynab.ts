import Datastore, { QueryPrimaryKeys } from './Datastore';
import { v4 as uuid } from 'uuid';

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

  public async getByUserId(userId: string): Promise<Schema> {
    const query: QueryPrimaryKeys = { HashKey: userId, RangeKey: RANGE_KEY };

    const result = await super.getItem(query);

    return isSchema(result) ? result : null;
  }

  public async getByYnabUserId(userId: string): Promise<Schema> {
    const query = { UserId: userId, RangeKey: RANGE_KEY };

    const result = await super.getItem(query, 'AuthIndex');

    return isSchema(result) ? result : null;
  }

  public async upsert(schema: Schema): Promise<Schema> {
    schema.RangeKey = RANGE_KEY;

    let hashKey: string;
    if (schema.HashKey === undefined) {
      const response = await this.getByYnabUserId(schema.UserId);
      hashKey = response?.HashKey ?? uuid();
    }

    schema.HashKey = hashKey;

    const result = await super.setItem(schema);

    return isSchema(result) ? result : null;
  }
}
