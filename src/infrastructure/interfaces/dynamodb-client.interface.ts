import {DocumentClient} from 'aws-sdk/clients/dynamodb';

export interface IDynamoDBClient {
  put(params: DocumentClient.PutItemInput): Promise<DocumentClient.PutItemOutput>;
  scan(params: DocumentClient.ScanInput): Promise<DocumentClient.ScanOutput>;
  get(params: DocumentClient.GetItemInput): Promise<DocumentClient.GetItemOutput>;
  query(params: DocumentClient.QueryInput): Promise<DocumentClient.QueryOutput>
}
