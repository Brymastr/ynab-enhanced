import { DynamoDB, GetItemInput, PutItemInput } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Tokens } from './types';

const TABLE_NAME = 'Sessions';

export default class Datastore {
  private client = new DynamoDB({});

  constructor() {}

  public async get(userId: string): Promise<Tokens> {
    const params: GetItemInput = {
      TableName: TABLE_NAME,
      Key: marshall({
        HashKey: userId,
      }),
    };

    const { Item } = await this.client.getItem(params);
    const tokens = unmarshall(Item);
    return {
      access_token: tokens.AccessToken,
      refresh_token: tokens.RefreshToken,
      expires_at: tokens.ExpiresAt,
    };
  }

  public async set(tokens: Tokens) {
    const params: PutItemInput = {
      TableName: TABLE_NAME,
      Item: marshall({
        AccessToken: tokens.access_token,
        RefreshToken: tokens.refresh_token,
        ExpiresAt: tokens.expires_at,
      }),
    };

    const result = await this.client.putItem(params);

    return result;
  }
}
