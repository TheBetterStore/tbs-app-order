import {OrderViewModel} from '../viewmodels/order-viewmodel';
import {ConfirmOrderRequestViewModel} from '../viewmodels/confirm-order-request.viewmodel';
import {Order} from '../../domain/entities/order';

export interface IAppOrderService {

  getOrder(orderId: string): Promise<OrderViewModel>;
  getOrders(customerId: string): Promise<OrderViewModel[]>;
  confirmOrder(o: ConfirmOrderRequestViewModel): Promise<Order>;
}
