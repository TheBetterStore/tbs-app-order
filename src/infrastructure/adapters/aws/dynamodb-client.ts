import {IDynamoDBClient} from '../../interfaces/dynamodb-client.interface';
import {injectable} from 'inversify';
import {DocumentClient, QueryInput} from 'aws-sdk/clients/dynamodb';
// const AWSXRay = require('aws-xray-sdk-core');
const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();
// AWSXRay.captureAWSClient(docClient.service);

@injectable()
/**
 * DynamoDBClient
 */
export class DynamoDBClient implements IDynamoDBClient {
  /**
   * scan
   * @param {QueryInput} params
   */
  async scan(params: QueryInput): Promise<DocumentClient.ScanOutput> {
    console.debug(`Scanning items`);
    return docClient.scan(params).promise();
  }

  /**
   * get
   * @param {GetItemInput} params
   */
  async get(params: DocumentClient.GetItemInput): Promise<DocumentClient.GetItemOutput> {
    console.debug('Getting from DynamoDB');
    return docClient.get(params).promise();
  }

  /**
   * put
   * @param {PutItemInput} params
   */
  async put(params: DocumentClient.PutItemInput): Promise<DocumentClient.PutItemOutput> {
    console.debug('Putting object to DynamoDB', params);
    const res = docClient.put(params).promise();
    console.debug('Returning...');
    return res;
  }

  /**
   * query
   * @param {QueryInput} params
   */
  async query(params: DocumentClient.QueryInput): Promise<DocumentClient.QueryOutput> {
    console.debug('Querying DynamoDB');
    return docClient.query(params).promise();
  }
}
