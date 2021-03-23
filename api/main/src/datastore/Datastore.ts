import { DynamoDB, QueryCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const TABLE_NAME = 'Users';

export interface QueryPrimaryKeys {
  HashKey?: string;
  RangeKey?: string;
}

export default class Datastore {
  protected client = new DynamoDB({});

  protected async getItem(query: Record<string, any>, index?: string) {
    const expressionAttributeValues: Record<string, any> = {};
    for (const [key, val] of Object.entries(query)) {
      expressionAttributeValues[`:${key}`] = val;
    }

    const params2 = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: index,
      KeyConditionExpression: Object.keys(query)
        .map(x => `${x} = :${x}`)
        .join(' and '),
      ExpressionAttributeValues: marshall(expressionAttributeValues),
    });

    const { Items } = await this.client.send(params2);
    console.dir(Items);

    return Items.length > 0 ? unmarshall(Items[0]) : {};
  }

  protected async setItem(query: Record<string, any>) {
    const { HashKey, RangeKey, ...rest } = query;

    const expressionAttributeValues: Record<string, any> = {};
    for (const [key, val] of Object.entries(rest)) {
      expressionAttributeValues[`:${key}`] = val;
    }

    const updateExpress = Object.keys(rest)
      .map(x => `${x} = :${x}`)
      .join(', ');

    const updateParams = new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: marshall({ HashKey, RangeKey }),
      ReturnValues: 'ALL_NEW',
      UpdateExpression: `SET ${updateExpress}`,
      ExpressionAttributeValues: marshall(expressionAttributeValues),
    });

    const result = await this.client.send(updateParams);

    return unmarshall(result.Attributes);
  }
}
