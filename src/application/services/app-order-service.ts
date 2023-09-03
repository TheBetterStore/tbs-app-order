import {inject, injectable} from 'inversify';
import TYPES from '../../infrastructure/types';
import {Logger} from '@thebetterstore/tbs-lib-infra-common/lib/logger';
import {IOrderRepository} from '../../infrastructure/interfaces/order-repository.interface';
import {IRestApiClient} from '../../infrastructure/interfaces/restapi-client.interface';
import * as util from 'util';
import {IAppOrderService} from './app-order-service.interface';
import {OrderViewModel} from '../viewmodels/order-viewmodel';
import {ConfirmOrderRequestViewModel} from '../viewmodels/confirm-order-request.viewmodel';
import {OrderViewModelMapper} from '../mappers/order-viewmodel.mapper';
import {PutEventsCommandInput} from '@aws-sdk/client-eventbridge';
import {IEventBridgeClient} from '../../infrastructure/interfaces/eventbridge-client.interface';
import {Order} from '../../domain/entities/order';

@injectable()
/**
 * OrderService
 */
export class AppOrderService implements IAppOrderService {
  private repo: IOrderRepository;
  private restApiClient: IRestApiClient;
  private eventBridgeClient: IEventBridgeClient;
  private tbsEventBridgeArn: string;
  private paymentApiUrl: string;

  /**
   * constructor
   * @param {IRestApiClient} restApiClient
   * @param {string} paymentApiUrl
   * @param {IEventBridgeClient} eventBridgeClient
   * @param {string} tbsEventBridgeArn
   * @param {IOrderRepository} repo
   */
  constructor(@inject(TYPES.IRestApiClient) restApiClient: IRestApiClient,
              @inject(TYPES.PaymentApiUrl) paymentApiUrl: string,
              @inject(TYPES.IEventBridgeClient) eventBridgeClient: IEventBridgeClient,
              @inject(TYPES.TbsEventBusArn) tbsEventBridgeArn: string,
              @inject(TYPES.IOrderRepository) repo: IOrderRepository) {
    this.restApiClient = restApiClient;
    this.repo = repo;
    this.eventBridgeClient= eventBridgeClient;
    this.tbsEventBridgeArn = tbsEventBridgeArn;
    this.paymentApiUrl = paymentApiUrl;
  }

  /**
   * getOrder
   * @param {string} orderId
   */
  async getOrder(orderId: string): Promise<OrderViewModel> {
    Logger.info('Entered getOrder');
    const result = await this.repo.getOrder(orderId);
    const vm = OrderViewModelMapper.mapOrderToOrderVM(result);
    Logger.info('Exiting getOrder');
    return vm;
  }

  /**
   * getOrders
   * @param {string} customerId
   */
  async getOrders(customerId: string): Promise<OrderViewModel[]> {
    Logger.info('Entered getOrders');
    const p = await this.repo.getOrders(customerId);
    const vm = p.map(OrderViewModelMapper.mapOrderToOrderVM);
    Logger.info('Exiting getOrders');
    return vm;
  }

  /**
   * confirmOrder
   * @param {ConfirmOrderRequestViewModel} o
   */
  async confirmOrder(o: ConfirmOrderRequestViewModel): Promise<Order> {
    Logger.info('Entered confirmOrder');

    Logger.info('First, confirming payment with vendor (Stripe)');

    const url = `${this.paymentApiUrl}/payment/v1/payments`;
    const payload = {
      tokenId: o.stripeToken,
      receiptEmail: o.receiptEmail,
      description: 'Order from The Better Store',
      chargeAmountInCents: o.netTotal * 100,
    };

    try {
      const result = await this.restApiClient.post(url, payload, {});
      if (result.status > 299) {
        Logger.error(`Error code ${result.status} was returned, with data: ${util.inspect(result.data)}` );
        throw new Error(`Could not confirm payment with Stripe; code is ${result.status}`);
      }
    } catch (e1) {
      throw e1;
    }

    const order: Order = OrderViewModelMapper.mapToNewOrder(o);
    const res = await this.createOrder(order);
    Logger.info('Exiting upsertOrder', res);
    return res;
  }

  /**
   * createOrder
   * @param {Order} o
   */
  async createOrder(o: Order): Promise<Order> {
    Logger.info('Entered createOrder');
    const res: Order = await this.repo.createOrder(o);
    const eventRes = await this.writeEvent(o);
    Logger.debug('Write event result:', JSON.stringify(eventRes));
    Logger.info('Exiting handleCreateOrderCommand', res);
    return res;
  }

  /**
   * writeEvent
   * @param {Order} o
   */
  async writeEvent(o: Order) {
    const event= JSON.stringify(
        {
          orderId: o.orderId,
          customerId: o.customerId,
          orderItems: o.orderItems,
          taxRate: o.taxRate,
          chargeTotal: o.amountCharged,
        });
    Logger.debug(event);

    // Send event for interested parties
    const params: PutEventsCommandInput = {
      Entries: [{
        Source: 'tbs-app-order.OrderCommandHandler',
        Detail: event,
        DetailType: 'OrderCreatedEvent',
        EventBusName: this.tbsEventBridgeArn,
      }],
    };
    Logger.debug(`Writing event with params:`, JSON.stringify(params));
    return this.eventBridgeClient.send(params);
  }
}
