import {inject, injectable} from 'inversify';
import TYPES from '../../infrastructure/types';
import {Logger} from '@thebetterstore/tbs-lib-infra-common/lib/logger';
import {IOrderRepository} from '../../infrastructure/interfaces/order-repository.interface';
import {IAppOrderService} from './app-order-service.interface';
import {OrderViewModel} from '../viewmodels/order-viewmodel';
import {OrderViewModelMapper} from '../mappers/order-viewmodel.mapper';
import {Order} from '../../domain/entities/order';
import {IParameterStoreClient} from '../../infrastructure/interfaces/parameterstore-client.interface';
import {IStripePaymentIntentEvent} from "../../infrastructure/interfaces/stripe-payment-intent-event";

@injectable()
/**
 * OrderService
 */
export class AppOrderService implements IAppOrderService {
  private repo: IOrderRepository;
  private parameterStoreClient: IParameterStoreClient;
  private static stripeSecretKey: string;

  /**
   * constructor
   * @param {IParameterStoreClient} parameterStoreClient
   * @param {IOrderRepository} repo
   */
  constructor(@inject(TYPES.IParameterStoreClient) parameterStoreClient: IParameterStoreClient,
              @inject(TYPES.IOrderRepository) repo: IOrderRepository) {
    this.parameterStoreClient = parameterStoreClient;
    this.repo = repo;
  }

  /**
   * getOrder
   * @param {string} customerId
   * @param {string} orderId
   * @returns {Promise}
   */
  async getOrder(customerId: string, orderId: string): Promise<OrderViewModel> {
    Logger.info('Entered getOrder');
    const result = await this.repo.getOrder(customerId, orderId);
    const vm = OrderViewModelMapper.mapOrderToOrderVM(result);
    Logger.info('Exiting getOrder');
    return vm;
  }

  /**
   * getOrders
   * @param {string} customerId
   * @returns {Promise}
   */
  async getOrders(customerId: string): Promise<OrderViewModel[]> {
    Logger.info('Entered getOrders');
    const p = await this.repo.getOrders(customerId);
    const vm = p.map(OrderViewModelMapper.mapOrderToOrderVM);
    Logger.info('Exiting getOrders');
    return vm;
  }

  /**
   * createOrder; Initialise customer order, create Strip PaymentIntent, and return this to the client if no errors to
   * allow payment to be confirmed
   * @param {OrderViewModel} o
   * @returns {Promise}
   */
  async createOrder(o: OrderViewModel): Promise<OrderViewModel> {
    Logger.info('Entered AppOrderService.createOrder');

    Logger.info('First, get Stripe secret key if not previously retrieved');
    if (!AppOrderService.stripeSecretKey) {
      AppOrderService.stripeSecretKey = await this.parameterStoreClient.getValue(
          process.env.STRIPE_SECRET_KEY_PARAM || '',
          true);
      // Logger.debug(`Retrieved key as ${AppOrderService.stripeSecretKey}`);
    }

    const order: Order = OrderViewModelMapper.mapToNewOrder(o);

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const stripe = require('stripe')(AppOrderService.stripeSecretKey);

    let intent: IStripePaymentIntentEvent;
    try {
      intent = await stripe.paymentIntents.create( {
        amount: Math.floor(o.netTotal * 100), // Converts to cents and truncate any floating-point digits
        currency: 'nzd',
        automatic_payment_methods: {enabled: true},
        receipt_email: order.receiptEmail,
        metadata: {
          customerId: order.customerId,
          orderId: order.orderId
        }
      });
    } catch (e1) {
      throw e1;
    }

    Logger.debug(`Received PaymentIntent response: `, JSON.stringify(intent));
    order.stripePaymentIntent.id = intent?.id;
    order.stripePaymentIntent.status = intent?.data?.object?.status;

    const result = await this.createOrderRec(order);
    const res = OrderViewModelMapper.mapOrderToOrderVM(result);

    res.paymentIntent = intent;
    Logger.info('Exiting createOrder', res);
    return res;
  }

  /**
   * confirmOrder via Stripe callback
   * @param {string} customerId
   * @param {string} orderId
   * @param {string} status
   */
  async confirmOrder(customerId: string, orderId: string, status: string) {

    const order = await this.repo.getOrder(customerId, orderId);
    order.stripePaymentIntent.status = status;
    order.status = 'PAID'
    await this.repo.updateOrder(order);
  }

  /**
   * createOrder
   * @param {Order} o
   * @returns {Promise}
   */
  async createOrderRec(o: Order): Promise<Order> {
    Logger.info('Entered AppOrderService.createOrderRec');
    Logger.debug('Writing order rec:', JSON.stringify(o));
    const res: Order = await this.repo.createOrder(o);
    // const eventRes = await this.writeEvent(o);
    // Logger.debug('Write event result:', JSON.stringify(eventRes));
    Logger.info('Exiting createOrder', res);
    return res;
  }
}
