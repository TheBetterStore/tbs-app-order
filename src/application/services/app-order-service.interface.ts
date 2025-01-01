import {OrderViewModel} from '../viewmodels/order-viewmodel';
import {ConfirmOrderRequestViewModel} from '../viewmodels/confirm-order-request.viewmodel';

export interface IAppOrderService {

  getOrder(orderId: string): Promise<OrderViewModel>;
  getOrders(customerId: string): Promise<OrderViewModel[]>;
  createOrder(o: ConfirmOrderRequestViewModel): Promise<OrderViewModel>;
  confirmOrder(o: any);
}
