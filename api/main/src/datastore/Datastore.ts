import { DynamoDB, GetItemCommand, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
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

    return Items.length > 0 ? unmarshall(Items[0]) : {};
  }

  protected async setItem(query: Record<string, any>) {
    const { HashKey, RangeKey } = query;

    const putParams = new PutItemCommand({
      TableName: TABLE_NAME,
      Item: marshall(query),
    });
    const getParams = new GetItemCommand({
      TableName: TABLE_NAME,
      Key: marshall({ HashKey, RangeKey }),
      ProjectionExpression: Object.keys(query).join(','),
    });

    // Stupid-ass dynamo doesn't return the result for putItem commands
    const result = await this.client.send(putParams);
    const actualResultLol = await this.client.send(getParams);

    return unmarshall(actualResultLol.Item);
  }
}
