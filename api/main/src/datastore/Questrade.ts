import Datastore, { QueryPrimaryKeys } from './Datastore';

export interface Tokens {
  AccessToken: string;
  RefreshToken: string;
  TokenType: string;
  Expiration: number;
}

export interface Schema extends Tokens {
  UserId: string;
  ApiServer: string;
}

export function isSchema(x: Record<string, any>): x is Schema {
  return (
    'UserId' in x &&
    'ApiServer' in x &&
    'AccessToken' in x &&
    'RefreshToken' &&
    'TokenType' in x &&
    'Expiration' in x
  );
}

const RANGE_KEY = 'Session';

export default class Session extends Datastore {
  constructor() {
    super();
  }

  public async get(userId: string): Promise<Schema> {
    const query: QueryPrimaryKeys = { HashKey: userId, RangeKey: RANGE_KEY };

    const result = await super.getItem(query);

    if (!isSchema(result)) return null;

    return result;
  }

  public async set(userId: string, schema: Schema) {
    const result = await super.setItem({ HashKey: userId, RangeKey: RANGE_KEY, ...schema });

    return result;
  }
}
