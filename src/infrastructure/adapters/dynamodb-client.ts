import {IDynamoDBClient} from '../interfaces/dynamodb-client.interface';
import {injectable} from 'inversify';
import {Logger} from '@thebetterstore/tbs-lib-infra-common/lib/logger';
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
    Logger.debug(`Scanning items`);
    return docClient.scan(params).promise();
  }

  /**
   * get
   * @param {GetItemInput} params
   */
  async get(params: DocumentClient.GetItemInput): Promise<DocumentClient.GetItemOutput> {
    Logger.debug('Getting from DynamoDB');
    return docClient.get(params).promise();
  }

  /**
   * put
   * @param {PutItemInput} params
   */
  async put(params: DocumentClient.PutItemInput): Promise<DocumentClient.PutItemOutput> {
    Logger.debug('Putting object to DynamoDB', params);
    const res = docClient.put(params).promise();
    Logger.debug('Returning...');
    return res;
  }

  /**
   * query
   * @param {QueryInput} params
   */
  async query(params: DocumentClient.QueryInput): Promise<DocumentClient.QueryOutput> {
    Logger.debug('Querying DynamoDB');
    return docClient.query(params).promise();
  }
}
