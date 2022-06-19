import {inject, injectable} from 'inversify';
import TYPES from '../../infrastructure/types';
import {Logger} from '@thebetterstore/tbs-lib-infra-common/lib/logger';
import {IOrderRepository} from '../../infrastructure/interfaces/order-repository.interface';
import {IRestApiClient} from '../../infrastructure/interfaces/restapi-client.interface';
import * as util from 'util';
import {IAppOrderService} from './app-order-service.interface';
import {OrderViewModel} from '../viewmodels/order-viewmodel';
import {ConfirmOrderRequestViewModel} from '../viewmodels/confirm-order-request.viewmodel';
import {IOrderCommandHandler} from '../handlers/order-command.handler.interface';
import {OrderViewModelMapper} from '../mappers/order-viewmodel.mapper';
import {CreateOrderCommand} from '../../domain/commands/create-order.command';

@injectable()
/**
 * OrderService
 */
export class AppOrderService implements IAppOrderService {
  private repo: IOrderRepository;
  private restApiClient: IRestApiClient;
  private paymentApiUrl: String;
  private orderCommandHandler: IOrderCommandHandler;

  /**
   * constructor
   * @param {IRestApiClient} restApiClient
   * @param {IOrderCommandHandler} orderCommandHandler
   * @param {string} paymentApiUrl
   * @param {IOrderRepository} repo
   */
  constructor(@inject(TYPES.IRestApiClient) restApiClient: IRestApiClient,
              @inject(TYPES.IOrderCommandHandler) orderCommandHandler: IOrderCommandHandler,
              @inject(TYPES.PaymentApiUrl) paymentApiUrl: string,
              @inject(TYPES.IOrderRepository) repo: IOrderRepository) {
    this.restApiClient = restApiClient;
    this.paymentApiUrl = paymentApiUrl;
    this.repo = repo;
    this.orderCommandHandler = orderCommandHandler;
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
  async confirmOrder(o: ConfirmOrderRequestViewModel): Promise<OrderViewModel> {
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

    const createOrderCmd: CreateOrderCommand = OrderViewModelMapper.mapToCreateNewOrderCommand(o);
    const res = await this.orderCommandHandler.handleCreateOrderCommand(createOrderCmd);
    Logger.info('Exiting upsertOrder', res);
    return res;
  }
}
