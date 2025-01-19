import {OrderViewModel} from '../viewmodels/order-viewmodel';

export interface IAppOrderService {

  getOrder(customerId: string, orderId: string): Promise<OrderViewModel>;
  getOrders(customerId: string): Promise<OrderViewModel[]>;
  createOrder(o: OrderViewModel): Promise<OrderViewModel>;
  confirmOrder(customerId: string, orderId: string, status: string);
}
