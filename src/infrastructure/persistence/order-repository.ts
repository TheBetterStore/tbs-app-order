import {IOrderRepository} from '../interfaces/order-repository.interface';
import {inject, injectable} from 'inversify';
import TYPES from '../types';
import {Logger} from '@thebetterstore/tbs-lib-infra-common/lib/logger';
import {IDynamoDBClient} from '../interfaces/dynamodb-client.interface';
import {DocumentClient} from 'aws-sdk/clients/dynamodb';
import {InvalidDataError} from '../../domain/models/errors/invalid-data-error';
import {Order} from '../../domain/entities/order';
import {OrderDto, OrderItemDto} from './order.dto';
import {OrderItemVO} from "../../domain/models/order-item.vo";
import util from 'util';

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
   */
  constructor(@inject(TYPES.IDynamoDBClient) ddbClient: IDynamoDBClient) {
    this.ddbClient = ddbClient;
    this.orderTableName = process.env.ORDER_TABLE_NAME || '';
  }

  /**
   * getOrder
   * @param {string} customerId
   * @param {string} orderId
   * @returns {Promise<Order>}
   */
  async getOrder(customerId: string, orderId: string): Promise<Order> {
    Logger.info('Entered OrderRepository.getOrder');
    const params: DocumentClient.GetItemInput = {
      TableName: this.orderTableName,
      Key: {
        'CustomerId': customerId,
        'OrderId': orderId
      },
    };
    const res = await this.ddbClient.get(params);
    Logger.info('Exiting OrderRepository.getOrder');;
    const order = toOrder(res.Item as OrderDto);
    return order;
  }

  /**
   * getOrders
   * @param {string} customerId
   * @returns {Promise<Order[]>}
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
    Logger.debug(`Params: ${JSON.stringify(params)}` );
    const res = await this.ddbClient.query(params);
    Logger.debug(`Received response from DB: ${JSON.stringify(res.Items)}` );
    let orders: Order[] = [];
    if (res.Items) {
      orders = res.Items.map(toOrder as any);
    }
    Logger.info('Exiting OrderRepository.getOrders');
    return orders as Order[];
  }

  /**
   * create
   * @param {Order} o
   * @returns {Promise<Order>}
   */
  async createOrder(o: Order): Promise<Order> {
    Logger.info('Entered OrderRepository.createOrder');
    const dto = OrderRepository.toDto(o);
    const params: DocumentClient.PutItemInput = {
      TableName: this.orderTableName,
      Item: dto,
      ReturnValues: 'ALL_OLD',
    };

    const res = await this.ddbClient.put(params);
    console.log(util.inspect(res));
    Logger.info('Exiting OrderRepository.createOrder');
    return o;
  }

  /**
   * update
   * @param {Order} p
   * @returns {Promise<Order>}
   */
  async updateOrder(p: Order): Promise<Order> {
    Logger.info('Entered OrderRepository.updateOrder');
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
    Logger.info('Exiting OrderRepository.updateOrder');
    return p;
  }

  /**
   * toDto
   * @param {Order} o
   * @returns {OrderDto}
   */
  static toDto(o: Order): OrderDto {
    const d: OrderDto = {
      OrderId: o.orderId,
      CustomerId: o.customerId,
      ReceiptEmail: o.receiptEmail,
      OrderItems: o.orderItems.map(toOrderItemDto),
      CreatedTime: o.createdTime,
      LastUpdatedTime: o.lastUpdatedTime,
      TaxRate: o.taxRate,
      AmountCharged: o.amountCharged,
      TaxTotal: o.getTaxTotal(),
      NetTotal: o.getNetTotal(),
      GrossTotal: o.getGrossTotal(),
    };
    return d;
  }
}

/**
 * toOrder
 * @param {OrderDto} o
 * @returns {Order}
 */
function toOrder(o: OrderDto): Order {
  const d: Order = new Order(o.OrderId || '', o.CustomerId, o.ReceiptEmail || '',
      o.OrderItems.map(toOrderItemVO as any), o.CreatedTime,
      o.LastUpdatedTime, o.TaxRate, o.AmountCharged);
  return d;
}

/**
 * toOrderItemDto
 * @param {OrderItemVO} o
 * @returns {OrderItemDto}
 */
function toOrderItemDto(o: OrderItemVO): OrderItemDto {
  const d: OrderItemDto = {
    Quantity: o.quantity,
    ProductId: o.productId,
    ProductName: o.productName,
    Price: o.price,
  };
  return d;
}

function toOrderItemVO(o: OrderItemDto): OrderItemVO {
  const d: OrderItemVO = {
    quantity: o.Quantity,
    productId: o.ProductId,
    productName: o.ProductName,
    price: o.Price,
  };
  return d;
}
