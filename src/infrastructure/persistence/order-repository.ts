import {IOrderRepository} from '../interfaces/order-repository.interface';
import {inject, injectable} from 'inversify';
import TYPES from '../types';
import {Logger} from '@thebetterstore/tbs-lib-infra-common/lib/logger';
import {IDynamoDBClient} from '../interfaces/dynamodb-client.interface';
import {DocumentClient} from 'aws-sdk/clients/dynamodb';
import {InvalidDataError} from '../../domain/models/errors/invalid-data-error';
import {Order} from '../../domain/entities/order';
import {OrderDto} from './order.dto';
const util = require('util');

@injectable()
/**
 * OrderRepository
 */
export class OrderRepository implements IOrderRepository {
  private ddbClient: IDynamoDBClient;
  private readonly orderTableName: string;

  /**
   * constructor
   * @param {IDynamoDBClient} ddbClient
   * @param {string} orderTableName
   */
  constructor(@inject(TYPES.IDynamoDBClient) ddbClient: IDynamoDBClient,
              @inject(TYPES.OrderTableName) orderTableName: string) {
    this.ddbClient = ddbClient;
    this.orderTableName = orderTableName;
  }

  /**
   * getOrder
   * @param {string} orderId
   */
  async getOrder(orderId: string): Promise<Order> {
    Logger.info('Entered OrderRepository.getOrder');
    const params: DocumentClient.GetItemInput = {
      TableName: this.orderTableName,
      Key: {
        'orderId': orderId,
      },
    };
    const res = await this.ddbClient.get(params);
    Logger.info('Exiting OrderRepository.getOrder');
    return res.Item as Order;
  }

  /**
   * getOrders
   * @param {string} customerId
   */
  async getOrders(customerId: string): Promise<Order[]> {
    Logger.info('Entered OrderRepository.getOrders');
    const params = {
      TableName: this.orderTableName,
      ExpressionAttributeValues: {
        ':cId': customerId,
      },
      KeyConditionExpression: 'CustomerId = :cId',
    };
    const res = await this.ddbClient.query(params);
    Logger.info('Exiting OrderRepository.getOrders');
    console.log(res.Items);
    return res.Items as Order[];
  }

  /**
   * create
   * @param {Order} o
   */
  async createOrder(o: Order): Promise<Order> {
    Logger.info('Entered OrderRepository.save');
    const dto = OrderRepository.toDto(o);
    const params: DocumentClient.PutItemInput = {
      TableName: this.orderTableName,
      Item: dto,
      ReturnValues: 'ALL_OLD',
    };

    const res = await this.ddbClient.put(params);
    console.log(util.inspect(res));
    Logger.info('Exiting OrderRepository.upsertOrder');
    return o;
  }

  /**
   * update
   * @param {Order} p
   */
  async updateOrder(p: Order): Promise<Order> {
    Logger.info('Entered OrderRepository.update');
    const currentTime = new Date();
    if (!p.orderId) {
      // Generate a random string - adding a random int to help prevent ms clash
      throw new InvalidDataError('Order ID is not provide on order object for updating');
    }
    p.lastUpdatedTime = currentTime.toISOString();

    const params: DocumentClient.PutItemInput = {
      TableName: this.orderTableName,
      Item: p,
      ReturnValues: 'ALL_OLD',
    };

    const res = await this.ddbClient.put(params);
    console.log(util.inspect(res));
    Logger.info('Exiting OrderRepository.upsertOrder');
    return p;
  }

  /**
   * toDto
   * @param {Order} o
   * @return {OrderDto}
   */
  static toDto(o: Order): OrderDto {
    const d: OrderDto = {
      orderId: o.orderId,
      customerId: o.customerId,
      receiptEmail: o.receiptEmail,
      orderItems: o.orderItems,
      createdTime: o.createdTime,
      lastUpdatedTime: o.lastUpdatedTime,
      taxRate: o.taxRate,
      amountCharged: o.amountCharged,
      taxTotal: o.getTaxTotal(),
      netTotal: o.getNetTotal(),
      grossTotal: o.getGrossTotal(),
    };
    return d;
  }

  /**
   * toOrder
   * @param {OrderDto} o
   * @return {Order}
   */
  static toOrder(o: OrderDto): Order {
    const d: Order = new Order(o.orderId || '', o.customerId, o.receiptEmail || '',
        o.orderItems, o.createdTime,
        o.lastUpdatedTime, o.taxRate, o.amountCharged);
    return d;
  }
}
