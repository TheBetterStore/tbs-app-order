import {inject, injectable} from 'inversify';
import {IOrderCommandHandler} from './order-command.handler.interface';
import TYPES from '../../infrastructure/types';
import {IRestApiClient} from '../../infrastructure/interfaces/restapi-client.interface';
import {IOrderRepository} from '../../infrastructure/interfaces/order-repository.interface';
import {CreateOrderCommand} from '../../domain/commands/create-order.command';
import {Order} from '../../domain/entities/order';
import {IEventBridgeClient} from '../../infrastructure/interfaces/eventbridge-client.interface';
import {PutEventsCommandInput} from '@aws-sdk/client-eventbridge';
import {Logger} from '@thebetterstore/tbs-lib-infra-common/lib/logger';

@injectable()
/**
 * OrderCommandHandler
 */
export class OrderCommandHandler implements IOrderCommandHandler {
  private repo: IOrderRepository;
  private eventBridgeClient: IEventBridgeClient;
  private tbsEventBridgeArn: string;

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
    this.repo = repo;
    this.eventBridgeClient= eventBridgeClient;
    this.tbsEventBridgeArn = tbsEventBridgeArn;
  }

  /**
   * handleCreateOrderCommand
   * @param {CreateOrderCommand} cmd
   */
  async handleCreateOrderCommand(cmd: CreateOrderCommand): Promise<Order> {
    Logger.info('Entered handleCreateOrderCommand');
    const o = OrderCommandHandler.toOrder(cmd);
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

  /**
   * toOrder
   * @param {CreateOrderCommand} cmd
   * @return {Order}
   */
  static toOrder(cmd: CreateOrderCommand): Order {
    const o = new Order(cmd.orderId, cmd.customerId, cmd.receiptEmail, cmd.orderItems, cmd.createdTime,
        cmd.createdTime, cmd.taxRate, cmd.chargeTotal);
    return o;
  }
}
